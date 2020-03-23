require('dotenv').config();
const Imap = require('imap');
const mongoose = require('mongoose');
const mailService = require('./mail.service');

// database url
const dbUrl = process.env.dbUrl;
//connecting database
mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true });
//upon connection
mongoose.connection.on('connected', () => {
    console.log('connected');
});
// error
mongoose.connection.on('error', (error) => {
    console.log(error);
});

let imap = new Imap({
    user: process.env.user,
    password: process.env.password,
    host: process.env.server,
    port: process.env.port,
    tls: true,
    keepalive: true
});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

imap.once('ready', function (err, res) {
    if (err) {
        console.log(err);
    }
    openInbox(function (err, box) {
        if (err) {
            console.log(err);
        }
        // listening for new mails
        imap.on('mail', function (id) {
            console.log('new mail::', id);
        });
        // fetching mails
        let f = imap.seq.fetch('1:*', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true
        });
        f.on('message', function(msg, seqno) {
          msg.on('body', function(stream, info) {
            let buffer = '';
            stream.on('data', function(chunk) {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', async function() {
              const mail = Imap.parseHeader(buffer);
              await mailService.save(mail);
            });
          });
    });
});
});

imap.connect();