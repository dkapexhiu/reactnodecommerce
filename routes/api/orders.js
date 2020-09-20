const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Orders = require('../../models/ordersModel');

let jsonParser = bodyParser.json();

// Nodemailer
const nodemailer = require('nodemailer');
const trans = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.N_EMAIL,
        pass: process.env.N_PASSWORD
    }
}
const transporter = nodemailer.createTransport(trans);

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        // console.log('Server is ready to send new orders emails');
    }
});

router.get('', jsonParser, (req, res) => {
    let promise = new Promise(function (resolve, reject) {
            Orders.get(resolve, reject);
        })
        .then(orders => {
            res.json(orders);
        })
        .catch(err => {
            return res.status(500).json(err);
        })
});

router.get('/:_id', jsonParser, (req, res) => {
    let promise = new Promise(function (resolve, reject) {
            Orders.getOne(resolve, reject, req.params._id);
        })
        .then(orders => {
            res.json(orders);
        })
        .catch(err => {
            return res.status(500).json(err);
        })
});

router.post('/ids', jsonParser, (req, res) => {
    let promise = new Promise(function (resolve, reject) {
            Orders.getByIds(resolve, reject, req.body.OrderIds);
        })
        .then(orders => {
            res.json(orders);
        })
        .catch(err => {
            return res.status(500).json(err);
        })
});

router.post('', jsonParser, (req, res) => {
    const requiredFields = ["username", "userEmail", "address", "products", "total", "paypalId"];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!(requiredFields[i] in req.body)) {
            return res.status(400).send(`Missing field ${requiredFields[i]}`);
        }
    }
    let promise = new Promise(function (resolve, reject) {
        Orders.create(resolve, reject, {
            username: req.body.username,
            userEmail: req.body.userEmail,
            address: req.body.address,
            products: req.body.products,
            total: req.body.total,
            paypalId: req.body.paypalId,
        });
    }).then(result => {
        res.status(201).json(result);
        // console.log(result);
        console.log("Order ID: " + result._id);
        console.log("Total: " + result.total);
        console.log("Date: " + result.date);
        transporter.sendMail({
            from: 'terralumx@gmail.com', // sender address
            to: result.userEmail, // list of receivers
            subject: 'Online Store - Order Received', // Subject line
            html: `<table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
              <tr style="vertical-align: top;" valign="top">
                <td style="word-break: break-word; vertical-align: top; border-collapse: collapse;" valign="top">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                  <div style="background-color:transparent;">
                    <div class="block-grid"
                      style="Margin: 0 auto; min-width: 320px; max-width: 480px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:480px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                        <!--[if (mso)|(IE)]><td align="center" width="480" style="background-color:transparent;width:480px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                        <div class="col num12"
                          style="min-width: 320px; max-width: 480px; display: table-cell; vertical-align: top;;">
                          <div style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div
                              style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                              <!--<![endif]-->
                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                              <div
                                style="color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                <div
                                  style="font-size: 12px; line-height: 14px; color: #555555; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                                  <p style="font-size: 12px; line-height: 14px; margin: 0;"><br></p>
                                </div>
                              </div>
                              <!--[if mso]></td></tr></table><![endif]-->
                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 30px; padding-bottom: 15px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                              <div
                                style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%;padding-top:30px;padding-right:30px;padding-bottom:15px;padding-left:30px;">
                                <div
                                  style="font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 12px; line-height: 14px; color: #555555;">
                                  <p style="font-size: 12px; line-height: 21px; text-align: center; margin: 0;"><span
                                      style="font-size: 18px;"><strong>Order: </strong> ` + result._id + `</span></p><br>
                                  <p style="font-size: 12px; line-height: 21px; text-align: center; margin: 0;"><span
                                      style="font-size: 18px;"><strong>Total: </strong>
                                      ` + result.total + `</span> </br> </p><br>
                                  <p style="font-size: 12px; line-height: 21px; text-align: center; margin: 0;"><span
                                      style="font-size: 18px;"><strong>Date/Time: </strong> ` + result.date + `</span></p>
                                </div>
                              </div>
                              <!--[if mso]></td></tr></table><![endif]-->
                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 5px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                              <div
                                style="color:#388e3c;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%;padding-top:0px;padding-right:0px;padding-bottom:5px;padding-left:0px;">
                                <div
                                  style="font-size: 12px; line-height: 14px; color: #388e3c; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;">
                                  <p style="font-size: 12px; line-height: 21px; text-align: center; margin: 0;"><span
                                      style="font-size: 18px;"><strong><span style="line-height: 21px; font-size: 18px;">Thank you for the order!</span></strong></span></p>
                                </div>
                              </div>
                              <!--[if mso]></td></tr></table><![endif]-->
                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 30px; font-family: Arial, sans-serif"><![endif]-->
                              <!--[if mso]></td></tr></table><![endif]-->
                              <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
                  <div style="background-color:#388e3c;">
                    <div class="block-grid"
                      style="Margin: 0 auto; min-width: 320px; max-width: 480px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#388e3c;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:480px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                        <!--[if (mso)|(IE)]><td align="center" width="480" style="background-color:transparent;width:480px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                        <div class="col num12"
                          style="min-width: 320px; max-width: 480px; display: table-cell; vertical-align: top;;">
                          <div style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div
                              style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                              <!--<![endif]-->
                              <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation"
                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                valign="top" width="100%">
                                <tbody>
                                  <tr style="vertical-align: top;" valign="top">
                                    <td class="divider_inner"
                                      style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; border-collapse: collapse;"
                                      valign="top">
                                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content"
                                        role="presentation"
                                        style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; border-top: 0px solid transparent;"
                                        valign="top" width="100%">
                                        <tbody>
                                          <tr style="vertical-align: top;" valign="top">
                                            <td
                                              style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-collapse: collapse;"
                                              valign="top"><span></span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
          
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>`
        }, (err, info) => {
            console.log(info.envelope);
            console.log(info.messageId);
        });
    }).catch(err => {
        return res.status(400).send(`Something unexpected occured ${err}`);
    });
});

router.put('/:_id', jsonParser, (req, res) => {
    let idParam = req.params._id;
    let idBody = req.body._id;
    if (idParam && idBody && idParam == idBody) {
        let promise = new Promise(function (resolve, reject) {
            let updatedOrder = {
                _id: idBody,
                username: req.body.username,
                address: req.body.address,
                products: req.body.products,
                total: req.body.total,
                paypalId: req.body.paypalId,
            }
            Orders.update(resolve, reject, idBody, updatedOrder);
        }).then(result => {
            console.log(req.body.userEmail);
            res.status(204).end();
        }).catch(err => {
            return res.status(500).json(err);
        });

    } else {
        return res.status(400).json({
            err: "Id does not coincide with body"
        });
    }
});

router.delete('/:_id', jsonParser, (req, res) => {
    if (req.params._id == req.body._id) {
        let promise = new Promise(function (resolve, reject) {
            Orders.delete(resolve, reject, req.body._id);
        }).then(result => {
            res.status(204).end();
        }).catch(err => {
            return res.status(400).send('Id not found in Orders');
        });
    } else {
        return res.status(400).send('Parameter does not coincide with body');
    }
});

module.exports = router;