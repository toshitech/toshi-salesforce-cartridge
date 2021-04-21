
var checkAvailability = require('dw/system/Site').getCurrent().getCustomPreferenceValue('toshiCheckStoreAvailability');

function checkCartAvailability(address, basket){
    var result = {
        productsAvailable : false,
        storeID : '',
        inventoryID: ''
    };
    var toshiStore = getToshiStore(address);
    if (toshiStore){
        var inventoryListId = toshiStore.custom.inventoryListId || '';
        var inventoryList = dw.catalog.ProductInventoryMgr.getInventoryList(inventoryListId);
        result['storeID'] = toshiStore.ID;
        result['inventory'] = inventoryListId;
        result['productsAvailable'] = inventoryList ? checkProducts(inventoryList, basket) : false;
    }
    return result;
}

function getToshiStore(address){
    var SystemObjectManager = require('dw/object/SystemObjectMgr');
    var OrderAddress = require('dw/order/OrderAddress');
    var countryCode = address.countryCode;
    if (address instanceof OrderAddress){
        countryCode = address.countryCode.value;
    } else {
        countryCode = address.countryCode;
    }
    var toshiStore = SystemObjectManager.querySystemObject('Store','countryCode ILIKE  {0} and custom.isToshiStore = {1}', countryCode, true);
    return toshiStore;
}

function checkProducts(inventory, basket){
    var result = true;
    var products = basket.getProductLineItems();
    if (checkAvailability){
        for each(var productLineItem in products) {
            var record = inventory.getRecord(productLineItem.product);
            if (!record || record.getATS().value < productLineItem.quantityValue){
                result = false;
            }
        }
    }
    return result;
}

exports.checkCartAvailability = checkCartAvailability;
exports.getToshiStore = getToshiStore;