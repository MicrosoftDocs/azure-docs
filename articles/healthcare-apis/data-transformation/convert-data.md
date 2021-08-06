---
title: Data conversion for Azure Healthcare APIs
description: Use the $convert-data endpoint and customize-converter templates to convert data in the Healthcare APIs
services: healthcare-apis
author: ranvijaykumar
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 05/11/2021
ms.author: ranku
---


# Converting your data to FHIR

> [!IMPORTANT]
> This capability is in public preview, and it's provided without a service level agreement. 
> It's not recommended for production workloads. Certain features might not be supported 
> or might have constrained capabilities. For more information, see 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The $convert-data custom endpoint in the FHIR service is meant for data conversion from different data types to FHIR. It uses the Liquid template engine and the templates from the [FHIR Converter](https://github.com/microsoft/FHIR-Converter) project as the default templates. You can customize these conversion templates as needed. Currently it supports two types of conversion, **C-CDA to FHIR** and **HL7v2 to FHIR** conversion.

## Use the $convert-data endpoint

The `$convert-data` operation is integrated into the FHIR service to run as part of the service. After enabling `$convert-data` in your server, you can make API calls to the server to convert your data into FHIR:

`https://<<FHIR service base URL>>/$convert-data`

### Parameter Resource

$convert-data takes a [Parameter](http://hl7.org/fhir/parameters.html) resource in the request body as described in the table below. In the API call request body, you would include the following parameters:

| Parameter Name      | Description | Accepted values |
| ----------- | ----------- | ----------- |
| inputData      | Data to be converted. | A valid JSON String|
| inputDataType   | Data type of input. | ```HL7v2```, ``Ccda`` |
| templateCollectionReference | Reference to an [OCI image ](https://github.com/opencontainers/image-spec) template collection on [Azure Container Registry (ACR)](https://azure.microsoft.com/services/container-registry/). It is the image containing Liquid templates to use for conversion. It can be a reference either to the default templates or a custom template image that is registered within the FHIR service. See below to learn about customizing the templates, hosting those on ACR, and registering to the FHIR service. | For **HL7v2** default templates: <br>```microsofthealth/fhirconverter:default``` <br>``microsofthealth/hl7v2templates:default``<br><br>For **C-CDA** default templates: ``microsofthealth/ccdatemplates:default`` <br>\<RegistryServer\>/\<imageName\>@\<imageDigest\>, \<RegistryServer\>/\<imageName\>:\<imageTag\> |
| rootTemplate | The root template to use while transforming the data. | For **HL7v2**:<br>```ADT_A01```, ```OML_O21```, ```ORU_R01```, ```VXU_V04```<br><br> For **C-CDA**:<br>```CCD```, `ConsultationNote`, `DischargeSummary`, `HistoryandPhysical`, `OperativeNote`, `ProcedureNote`, `ProgressNote`, `ReferralNote`, `TransferSummary` |

> [!WARNING]
> Default templates are released under MIT License and are **not** supported by Microsoft Support.
>
> Default templates are provided only to help you get started quickly. They may get updated when we update versions of the Azure API for FHIR. Therefore, you must verify the conversion behavior and **host your own copy of templates** on an Azure Container Registry, register those to the Azure API for FHIR, and use in your API calls in order to have consistent data conversion behavior across the different versions of Azure API for FHIR.

#### Sample Request

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "inputData",
            "valueString": "MSH|^~\\&|SIMHOSP|SFAC|RAPP|RFAC|20200508131015||ADT^A01|517|T|2.3|||AL||44|ASCII\nEVN|A01|20200508131015|||C005^Whittingham^Sylvia^^^Dr^^^DRNBR^PRSNL^^^ORGDR|\nPID|1|3735064194^^^SIMULATOR MRN^MRN|3735064194^^^SIMULATOR MRN^MRN~2021051528^^^NHSNBR^NHSNMBR||Kinmonth^Joanna^Chelsea^^Ms^^CURRENT||19870624000000|F|||89 Transaction House^Handmaiden Street^Wembley^^FV75 4GJ^GBR^HOME||020 3614 5541^HOME|||||||||C^White - Other^^^||||||||\nPD1|||FAMILY PRACTICE^^12345|\nPV1|1|I|OtherWard^MainRoom^Bed 183^Simulated Hospital^^BED^Main Building^4|28b|||C005^Whittingham^Sylvia^^^Dr^^^DRNBR^PRSNL^^^ORGDR|||CAR|||||||||16094728916771313876^^^^visitid||||||||||||||||||||||ARRIVED|||20200508131015||"
        },
        {
            "name": "inputDataType",
            "valueString": "Hl7v2"
        },
        {
            "name": "templateCollectionReference",
            "valueString": "microsofthealth/fhirconverter:default"
        },
        {
            "name": "rootTemplate",
            "valueString": "ADT_A01"
        }
    ]
}
```

#### Sample Response

```json
{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "urn:uuid:9d697ec3-48c3-3e17-db6a-29a1765e22c6",
      "resource": {
        "resourceType": "Patient",
        "id": "9d697ec3-48c3-3e17-db6a-29a1765e22c6",
        ...
        ...
      "request": {
        "method": "PUT",
        "url": "Location/50becdb5-ff56-56c6-40a1-6d554dca80f0"
      }
    }
  ]
}
```

## Customize templates

You can use the [FHIR Converter extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) for Visual Studio Code to customize the templates as per your needs. The extension provides an interactive editing experience, and makes it easy to download Microsoft-published templates and sample data. Refer to the documentation in the extension for more details.

## Host and use templates

It's strongly recommended that you host your own copy of templates on ACR. There're four steps involved in hosting your own copy of templates and using those in the $convert-data operation:

1. Push the templates to your Azure Container Registry.
1. Enable Managed Identity on your FHIR service instance.
1. Provide access of the ACR to the FHIR service Managed Identity.
1. Register the ACR servers in the FHIR service.
1. Optionally configure ACR firewall for secure access.

### Push templates to Azure Container Registry

After creating an ACR instance, you can use the _FHIR Converter: Push Templates_ command in the [FHIR Converter extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to push the customized templates to the ACR. Alternatively, you can use the [Template Management CLI tool](https://github.com/microsoft/FHIR-Converter/blob/main/docs/TemplateManagementCLI.md) for this purpose.

### Enable Managed Identity on FHIR service

Browse to your instance of FHIR service service in the Azure portal, and then select the **Identity** blade.
Change the status to **On** to enable managed identity in FHIR service.

![Enable Managed Identity](media/convert-data/fhir-mi-enabled.png)

### Provide access of the ACR to FHIR service

1. Browse to the **Access control (IAM)** blade.

1. Select **Add**, and then select **Add role assignment** to open the Add role assignment page.

1. Assign the [AcrPull](../../role-based-access-control/built-in-roles.md#acrpull) role. 

   ![Add role assignment page](../../../includes/role-based-access-control/media/add-role-assignment-page.png) 

For more information about assigning roles in the Azure portal, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.md).

### Register the ACR servers in FHIR service

You can register the ACR server using the Azure portal, or using CLI.

#### Registering the ACR server using Azure portal
Browse to the **Artifacts** blade under **Data transformation** in your FHIR service instance. You will see the list of currently registered ACR servers. Select **Add**, and then select your registry server from the drop-down menu. You'll need to select **Save** for the registration to take effect. It may take a few minutes to apply the change and restart your instance.

#### Registering the ACR server using CLI
You can register up to 20 ACR servers in the FHIR service.

Install the Healthcare APIs CLI from Azure PowerShell if needed:

```powershell
az extension add -n healthcareapis
```

Register the acr servers to FHIR service following the examples below:

##### Register a single ACR server

```powershell
az healthcareapis acr add --login-servers "fhiracr2021.azurecr.io" --resource-group fhir-test --resource-name fhirtest2021
```

##### Register multiple ACR servers

```powershell
az healthcareapis acr add --login-servers "fhiracr2021.azurecr.io fhiracr2020.azurecr.io" --resource-group fhir-test --resource-name fhirtest2021
```
### Configure ACR firewall

Select **Networking** of the Azure storage account from the portal.

   :::image type="content" source="media/convert-data/networking-container-registry.png" alt-text="Container registry.":::


Select **Selected networks**. 

Under the **Firewall** section, specify the IP address in the **Address range** box. Add IP ranges to allow access from the internet or your on-premises networks. 

In the table below, you'll find the IP address for the Azure region where the FHIR service service is provisioned.

|**Azure Region**         |**Public IP Address** |
|:----------------------|:-------------------|
| Australia East       | 20.53.44.80       |
| Canada Central       | 20.48.192.84      |
| Central US           | 52.182.208.31     |
| East US              | 20.62.128.148     |
| East US 2            | 20.49.102.228     |
| East US 2 EUAP       | 20.39.26.254      |
| Germany North        | 51.116.51.33      |
| Germany West Central | 51.116.146.216    |
| Japan East           | 20.191.160.26     |
| Korea Central        | 20.41.69.51       |
| North Central US     | 20.49.114.188     |
| North Europe         | 52.146.131.52     |
| South Africa North   | 102.133.220.197   |
| South Central US     | 13.73.254.220     |
| Southeast Asia       | 23.98.108.42      |
| Switzerland North    | 51.107.60.95      |
| UK South             | 51.104.30.170     |
| UK West              | 51.137.164.94     |
| West Central US      | 52.150.156.44     |
| West Europe          | 20.61.98.66       |
| West US 2            | 40.64.135.77      |


> [!NOTE]
> The above steps are similar to the configuration steps described in the document How to export FHIR data. For more information, see [Secure Export to Azure Storage](./export-data.md#secure-export-to-azure-storage)

### Verify

Make a call to the $convert-data API specifying your template reference in the templateCollectionReference parameter.

`<RegistryServer>/<imageName>@<imageDigest>`