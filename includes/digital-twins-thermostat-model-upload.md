---
author: baanders
description: include file to upload a model to Azure Digital Twins instance
ms.service: digital-twins
ms.topic: include
ms.date: 3/23/2021
ms.author: baanders
---

The model looks like this:
:::code language="json" source="~/digital-twins-docs-samples/models/Thermostat.json":::

To **upload this model to your twins instance**, run the following Azure CLI command, which uploads the above model as inline JSON. You can run the command in [Azure Cloud Shell](../articles/cloud-shell/overview.md) in your browser, or on your machine if you have the CLI [installed locally](/cli/azure/install-azure-cli).

```azurecli-interactive
az dt model create --models '{  "@id": "dtmi:contosocom:DigitalTwins:Thermostat;1",  "@type": "Interface",  "@context": "dtmi:dtdl:context;2",  "contents": [    {      "@type": "Property",      "name": "Temperature",      "schema": "double"    }  ]}' -n {digital_twins_instance_name}
```

> [!Note]
> If you are using Cloud Shell in the PowerShell environment, you may need to escape the quotation mark characters on the inline JSON fields for their values to be parsed correctly. Here is the command to upload the model with this modification:
>
> Upload model:
> ```azurecli-interactive
> az dt model create --models '{  \"@id\": \"dtmi:contosocom:DigitalTwins:Thermostat;1\",  \"@type\": \"Interface\",  \"@context\": \"dtmi:dtdl:context;2\",  \"contents\": [    {      \"@type\": \"Property\",      \"name\": \"Temperature\",      \"schema\": \"double\"    }  ]}' -n {digital_twins_instance_name}
> ```