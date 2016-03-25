## Overview of Azure Resource Manager templates

Azure Resource Manager templates allow you to declaratively specify the Azure IaaS infrastructure in Json language by defining the dependencies between resources. For a detailed overview of Azure Resource Manager Templates, please refer to the article below:

[Resource Group Overview](../articles/resource-group-overview.md)

## Sample template snippet for VM extensions
Deploying VM extensions as part of an Azure Resource Manager template requires you to declaratively specify the extension configuration in the template.
Here is the format for specifying the extension configuration.

      {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "MyExtension",
      "apiVersion": "2015-05-01-preview",
      "location": "[parameters('location')]",
      "dependsOn": ["[concat('Microsoft.Compute/virtualMachines/',parameters('vmName'))]"],
      "properties":
      {
      "publisher": "Publisher Namespace",
      "type": "extension Name",
      "typeHandlerVersion": "extension version",
      "settings": {
      // Extension specific configuration goes in here.
      }
      }
      }

As you can see from the above, the extension template contains two main parts:

1. Extension name, publisher and version
2. Extension Configuration.

## Identifying the publisher, type, and typeHandlerVersion for any extension

Azure VM extensions are published by Microsoft and trusted 3rd party publishers and each extension is uniquely identified by its publisher,type and the typeHandlerVersion. These can be determined as following:  