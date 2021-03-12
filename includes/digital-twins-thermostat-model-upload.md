---
author: baanders
description: include file to upload a model and create a twin for an Azure Digital Twins instance
ms.service: digital-twins
ms.topic: include
ms.date: 3/12/2021
ms.author: baanders
---

The model looks like this:
:::code language="json" source="~/digital-twins-docs-samples/models/Thermostat.json":::

To **upload this model to your twins instance**, run the following Azure CLI command, which uploads the above model as inline JSON. You can run the command in [Azure Cloud Shell](/cloud-shell/overview.md) in your browser, or on your machine if you have the CLI [installed locally](/cli/azure/install-azure-cli.md).

```azurecli-interactive
az dt model create --models '{  "@id": "dtmi:contosocom:DigitalTwins:Thermostat;1",  "@type": "Interface",  "@context": "dtmi:dtdl:context;2",  "contents": [    {      "@type": "Property",      "name": "Temperature",      "schema": "double"    }  ]}' -n {digital_twins_instance_name}
```

You'll then need to **create one twin using this model**. Use the following command to create a thermostat twin named **thermostat67**, and set 0.0 as an initial temperature value.

```azurecli-interactive
az dt twin create --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id thermostat67 --properties '{"Temperature": 0.0,}' --dt-name {digital_twins_instance_name}
```

>[!NOTE]
> If you are using Cloud Shell in the PowerShell environment, you may need to escape the quotation mark characters on the inline JSON fields for their values to be parsed correctly. Here are the commands to upload the model and create the twin with this modification:
>
> Upload model:
> ```azurecli-interactive
> az dt model create --models '{  \"@id\": \"dtmi:contosocom:DigitalTwins:Thermostat;1\",  \"@type\": \"Interface\",  \"@context\": \"dtmi:dtdl:context;2\",  \"contents\": [    {      \"@type\": \"Property\",      \"name\": \"Temperature\",      \"schema\": \"double\"    }  ]}' -n {digital_twins_instance_name}
> ```
>
> Create twin:
> ```azurecli-interactive
> az dt twin create --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id thermostat67 --properties '{\"Temperature\": 0.0,}' --dt-name {digital_twins_instance_name}
> ```

When the twin is created successfully, the CLI output from the command should look something like this:
```json
{
  "$dtId": "thermostat67",
  "$etag": "W/\"0000000-9735-4f41-98d5-90d68e673e15\"",
  "$metadata": {
    "$model": "dtmi:contosocom:DigitalTwins:Thermostat;1",
    "Temperature": {
      "ackCode": 200,
      "ackDescription": "Auto-Sync",
      "ackVersion": 1,
      "desiredValue": 0.0,
      "desiredVersion": 1
    }
  },
  "Temperature": 0.0
}
```
For more information about models, refer to [*How-to: Manage models*](how-to-manage-model.md#upload-models).