var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');
var toshiClient = require('*/cartridge/scripts/toshi/toshiClient');

function Authorize(args) {
    var orderNo = args.OrderNo;
    var order = args.Order;
    var authorizedVal = false;
    if (toshiClient.isTryBeforeYouBuy(order)) {
        var paymentInstrument = args.PaymentInstrument;
        var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();
    
        Transaction.wrap(function () {
            paymentInstrument.paymentTransaction.transactionID = orderNo;
            paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
        });
        authorizedVal = true;
    }

    return {authorized: authorizedVal};
}


exports.Authorize = Authorize;