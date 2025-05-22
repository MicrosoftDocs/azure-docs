---
author: baanders
description: include file to upload a model to Azure Digital Twins instance
ms.service: azure-digital-twins
ms.topic: include
ms.date: 03/13/2025
ms.author: baanders
---

The model looks like this:
:::code language="json" source="~/digital-twins-docs-samples/models/Thermostat.json":::

To upload this model to your twins instance, run the following Azure CLI command, which uploads the previous model as inline JSON. You can run the command in [Azure Cloud Shell](../../cloud-shell/overview.md) in your browser (use the Bash environment), or on your machine if you have the [CLI installed locally](/cli/azure/install-azure-cli). There's one placeholder for the instance's host name (you can also use the instance's friendly name with a slight decrease in performance).

```azurecli-interactive
az dt model create --dt-name <instance-hostname-or-name> --models '{  "@id": "dtmi:contosocom:DigitalTwins:Thermostat;1",  "@type": "Interface",  "@context": "dtmi:dtdl:context;3",  "contents": [    {      "@type": "Property",      "name": "Temperature",      "schema": "double"    }  ]}' 
```

>[!NOTE]
>If you're using anything other than Cloud Shell in the Bash environment, you might need to escape certain characters in the inline JSON so that it parses correctly. For more information, see [Use special characters in different shells](../concepts-cli.md#use-special-characters-in-different-shells).