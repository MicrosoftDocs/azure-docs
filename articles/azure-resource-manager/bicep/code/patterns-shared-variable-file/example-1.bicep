var sharedNamePrefixes = json(loadTextContent('./shared-prefixes.json'))

var appServiceAppName = '${sharedNamePrefixes.appServicePrefix}-myapp-${uniqueString(resourceGroup().id)}'
var storageAccountName = '${sharedNamePrefixes.storageAccountPrefix}myapp${uniqueString(resourceGroup().id)}'
