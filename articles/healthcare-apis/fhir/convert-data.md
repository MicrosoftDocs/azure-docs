---
title: Convert your data to FHIR in Azure Health Data Services
description: This article describes how to use the $convert-data endpoint and custom converter templates to convert data to FHIR in Azure Health Data Services.
services: healthcare-apis
author: irenepjoseph
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 03/09/2023
ms.author: irenejoseph
ms.custom: subject-rbac-steps
---


# Convert your data to FHIR

By using the `$convert-data` custom endpoint in the FHIR service, you can convert health data from various formats to FHIR. The `$convert-data` operation uses [Liquid](https://shopify.github.io/liquid/) templates from the [FHIR Converter](https://github.com/microsoft/FHIR-Converter) project for FHIR data conversion. You can customize these conversion templates as needed. Currently, the `$convert-data` operation supports three types of data conversion: 
* HL7v2 to FHIR
* C-CDA to FHIR
* JSON to FHIR (intended for custom conversion mapping)
* FHIR STU3 to FHIR R4

> [!NOTE]
> You can use the `$convert-data` endpoint as a component within an ETL (extract, transform, load) pipeline for the conversion of health data formats into the FHIR format. However, the `$convert-data` operation is not an ETL pipeline in itself. For a complete workflow as you convert your data to FHIR, we recommend that you use an ETL engine that's based on Azure Logic Apps or Azure Data Factory. The workflow might include: data reading and ingestion, data validation, making `$convert-data` API calls, data pre/post-processing, data enrichment, data deduplication, and loading the data for persistence in the FHIR service.

## Use the `$convert-data` endpoint

The `$convert-data` operation is integrated into the FHIR service as a RESTful API action. You can call the `$convert-data` endpoint as follows:

`POST {{fhirurl}}/$convert-data`

The health data for conversion is delivered to the FHIR service in the body of the `$convert-data` request. If the request is successful, the FHIR service will return a FHIR `Bundle` response with the data converted to FHIR.

### Parameters Resource

A `$convert-data` API call packages the health data for conversion inside a JSON-formatted [Parameters Resource](http://hl7.org/fhir/parameters.html) in the body of the request. The parameters are described in the following table: 

| Parameter name      | Description&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Accepted values |
| ----------- | ----------- | ----------- |
| `inputData`      | Data payload to be converted to FHIR. | For `Hl7v2`: string <br> For `Ccda`: XML <br> For `Json`: JSON <br> For `FHIR STU3`: JSON|
| `inputDataType`   | Type of data input. | `Hl7v2`, `Ccda`, `Json`, `Fhir` |
| `templateCollectionReference` | Reference to an [OCI image](https://github.com/opencontainers/image-spec) template collection in [Azure Container Registry](https://azure.microsoft.com/services/container-registry/). The reference is to an image that contains Liquid templates to use for conversion. It can refer either to default templates or to a custom template image that's registered within the FHIR service. The following sections cover customizing the templates, hosting them on Azure Container Registry, and registering to the FHIR service. | For **default/sample** templates: <br> **HL7v2** templates: <br>`microsofthealth/fhirconverter:default` <br>``microsofthealth/hl7v2templates:default``<br> **C-CDA** templates: <br> ``microsofthealth/ccdatemplates:default`` <br> **JSON** templates: <br> ``microsofthealth/jsontemplates:default`` <br> **FHIR STU3** templates: <br> ``microsofthealth/stu3tor4templates:default`` <br><br> For **custom** templates: <br> `<RegistryServer>/<imageName>@<imageDigest>`, `<RegistryServer>/<imageName>:<imageTag>` |
| `rootTemplate` | The root template to use while transforming the data. | For **HL7v2**:<br> "ADT_A01", "ADT_A02", "ADT_A03", "ADT_A04", "ADT_A05", "ADT_A08", "ADT_A11",  "ADT_A13", "ADT_A14", "ADT_A15", "ADT_A16", "ADT_A25", "ADT_A26", "ADT_A27", "ADT_A28", "ADT_A29", "ADT_A31", "ADT_A47", "ADT_A60", "OML_O21", "ORU_R01", "ORM_O01", "VXU_V04", "SIU_S12", "SIU_S13", "SIU_S14", "SIU_S15", "SIU_S16", "SIU_S17", "SIU_S26", "MDM_T01", "MDM_T02"<br><br> For **C-CDA**:<br> "CCD", "ConsultationNote", "DischargeSummary", "HistoryandPhysical", "OperativeNote", "ProcedureNote", "ProgressNote", "ReferralNote", "TransferSummary" <br><br> For **JSON**: <br> "ExamplePatient", "Stu3ChargeItem" <br><br> For **FHIR STU3**: <br> STU3 Resource Name e.g., "Patient", "Observation", "Organization" <br> |

> [!NOTE]
> FHIR STU3 to R4 templates are "diff" Liquid templates that provide mappings of field differences only between STU3 resource and its equivalent resource in FHIR R4 standard.Some of the STU3 resources are renamed or removed from R4. Please refer to [Resource differences and constraints for STU3 to R4 conversion](https://github.com/microsoft/FHIR-Converter/blob/main/docs/Stu3R4-resources-differences.md).

> [!NOTE]
> JSON templates are sample templates for use in building your own conversion mappings. They are *not* "default" templates that adhere to any pre-defined health data message types. JSON itself is not specified as a health data format, unlike HL7v2 or C-CDA. Therefore, instead of providing "default" JSON templates, we provide some sample JSON templates that you can use as a starting guide for your own customized mappings.

> [!WARNING]
> Default templates are released under the MIT License and are *not* supported by Microsoft Support.
>
> We provide default templates only to help you get started with your data conversion workflow. These default templates are not intended for production and might change when Microsoft releases updates for the FHIR service. To have consistent data conversion behavior across different versions of the FHIR service, you must do the following:
> 1. Host your own copy of the templates in an Azure Container Registry instance.
> 2. Register the templates to the FHIR service. 
> 3. Use your registered templates in your API calls.
> 4. Verify that the conversion behavior meets your requirements. 

#### Sample request

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "inputData",
            "valueString": "MSH|^~\\&|SIMHOSP|SFAC|RAPP|RFAC|20200508131015||ADT^A01|517|T|2.3|||AL||44|ASCII\nEVN|A01|20200508131015|||C005^Whittingham^Sylvia^^^Dr^^^DRNBR^D^^^ORGDR|\nPID|1|3735064194^^^SIMULATOR MRN^MRN|3735064194^^^SIMULATOR MRN^MRN~2021051528^^^NHSNBR^NHSNMBR||Kinmonth^Joanna^Chelsea^^Ms^^D||19870624000000|F|||89 Transaction House^Handmaiden Street^Wembley^^FV75 4GJ^GBR^HOME||020 3614 5541^PRN|||||||||C^White - Other^^^||||||||\nPD1|||FAMILY PRACTICE^^12345|\nPV1|1|I|OtherWard^MainRoom^Bed 183^Simulated Hospital^^BED^Main Building^4|28b|||C005^Whittingham^Sylvia^^^Dr^^^DRNBR^D^^^ORGDR|||CAR|||||||||16094728916771313876^^^^visitid||||||||||||||||||||||ARRIVED|||20200508131015||"
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

#### Sample response

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
            }
      "request": {
        "method": "PUT",
        "url": "Location/50becdb5-ff56-56c6-40a1-6d554dca80f0"
      }
    }
  ]
}
```

## Customize templates

You can use the [FHIR Converter Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to customize templates according to your specific requirements. The extension provides an interactive editing experience and makes it easy to download Microsoft-published templates and sample data. Refer to the extension documentation for more details.

> [!NOTE]
> FHIR Converter extension for Visual Studio Code is available for HL7v2, C-CDA and JSON Liquid templates. FHIR STU3 to R4 Liquid templates are currently not supported. 

## Host your own templates

We recommend that you host your own copy of templates in an Azure Container Registry instance. Hosting your own templates and using them for `$convert-data` operations involves the following six steps:

1. [Create an Azure Container Registry instance](#step-1-create-an-azure-container-registry-instance)
2. [Push the templates to your Azure Container Registry instance](#step-2-push-the-templates-to-your-azure-container-registry-instance)
3. [Enable Azure Managed Identity in your FHIR service instance](#step-3-enable-azure-managed-identity-in-your-fhir-service-instance)
4. [Provide Azure Container Registry access to the FHIR service managed identity](#step-4-provide-azure-container-registry-access-to-the-fhir-service-managed-identity)
5. [Register the Azure Container Registry server in the FHIR service](#step-5-register-the-azure-container-registry-server-in-the-fhir-service)
6. [(Optional) Configure the Azure Container Registry firewall for secure access](#step-6-optional-configure-the-azure-container-registry-firewall-for-secure-access)

### Step 1: Create an Azure Container Registry instance

Read the [Introduction to container registries in Azure](../../container-registry/container-registry-intro.md) and follow the instructions for creating your own Azure Container Registry instance. We recommend that you place your Azure Container Registry instance in the same resource group as your FHIR service.

### Step 2: Push the templates to your Azure Container Registry instance

After you create an Azure Container Registry instance, you can use the **FHIR Converter: Push Templates** command in the [FHIR Converter extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to push your custom templates to your Azure Container Registry instance. Alternatively, you can use the [Template Management CLI tool](https://github.com/microsoft/FHIR-Converter/blob/main/docs/TemplateManagementCLI.md) for this purpose.

### Step 3: Enable Azure Managed Identity in your FHIR service instance

1. Go to your instance of the FHIR service in the Azure portal, and then select the **Identity** blade.
1. Change the status to **On** to enable Managed Identity in the FHIR service.

   ![Screenshot of the FHIR pane for enabling the Managed Identity feature.](media/convert-data/fhir-mi-enabled.png#lightbox)

### Step 4: Provide Azure Container Registry access to the FHIR service managed identity

1. In your resource group, go to your **Container Registry** instance, and then select the **Access control (IAM)** tab.

2. Select **Add** > **Add role assignment**. If the **Add role assignment** option is unavailable, ask your Azure administrator to grant you permissions for performing this task.

   ![Screenshot of the "Access control" pane and the "Add role assignment" menu.](../../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

   :::image type="content" source="../../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot of the 'Access control' pane and the 'Add role assignment' menu.":::

3. On the **Role** pane, select the [AcrPull](../../role-based-access-control/built-in-roles.md#acrpull) role.

   [![Screenshot showing the "Add role assignment" pane.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)](../../../includes/role-based-access-control/media/add-role-assignment-page.png#lightbox)

4. On the **Members** tab, select **Managed identity**, and then select **Select members**.

5. Select your Azure subscription.

6. Select **System-assigned managed identity**, and then select the FHIR service you're working with.

7. On the **Review + assign** tab, select **Review + assign** to assign the role.

For more information about assigning roles in the Azure portal, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.md).

### Step 5: Register the Azure Container Registry server in the FHIR service

You can register the Azure Container Registry server by using the Azure portal or the Azure CLI.

To use the Azure portal:

1. In your FHIR service instance, under **Data transformation**, go to the **Artifacts** pane. 

   A list of currently registered Azure Container Registry servers is displayed. 
1. Select **Add** and then, in the dropdown list, select your registry server. 
1. Select **Save**. 

   It might take a few minutes for the registration to take effect.

To use the Azure CLI:

You can register up to 20 Azure Container Registry servers in the FHIR service.

1. Install the Azure Health Data Services CLI, if needed, by running the following command:

    ```azurecli
    az extension add -n healthcareapis
    ```

1. Register the Azure Container Registry servers to the FHIR service by doing either of the following:

    * To register a single Azure Container Registry server, run:

        ```azurecli
        az healthcareapis acr add --login-servers "fhiracr2021.azurecr.io" --resource-group fhir-test --resource-name fhirtest2021
        ```

    * To register multiple Azure Container Registry servers, run:

        ```azurecli
        az healthcareapis acr add --login-servers "fhiracr2021.azurecr.io fhiracr2020.azurecr.io" --resource-group fhir-test --resource-name fhirtest2021
        ```
### Step 6: (Optional) Configure the Azure Container Registry firewall for secure access

1. In the Azure portal, on the left pane, select **Networking** for the Azure Container Registry instance.

   ![Screenshot of the "Networking" pane for configuring an Azure Container Registry firewall.](media/convert-data/networking-container-registry.png#lightbox)

1. On the **Public access** tab, select **Selected networks**. 

1. In the **Firewall** section, specify the IP address in the **Address range** box. 

   Add IP ranges to allow access from the internet or your on-premises networks. 

The following table lists the IP addresses for the Azure regions where the FHIR service is set up:

| Azure region         | Public IP address |
|:----------------------|:-------------------|
| Australia East       | 20.53.47.210      |
| Brazil South         | 191.238.72.227    |
| Canada Central       | 20.48.197.161     |
| Central India        | 20.192.47.66      |
| East US              | 20.62.134.242, 20.62.134.244, 20.62.134.245     |
| East US 2            | 20.62.60.115, 20.62.60.116, 20.62.60.117    |
| France Central       | 51.138.211.19     |
| Germany North        | 51.116.60.240     |
| Germany West Central | 20.52.88.224      |
| Japan East           | 20.191.167.146    |
| Japan West           | 20.189.228.225    |
| Korea Central        | 20.194.75.193     |
| North Central US     | 52.162.111.130, 20.51.0.209   |
| North Europe         | 52.146.137.179    |
| Qatar Central        | 20.21.36.225      |
| South Africa North   | 102.133.220.199   |
| South Central US     | 20.65.134.83      |
| Southeast Asia       | 20.195.67.208     |
| Sweden Central       | 51.12.28.100      |
| Switzerland North    | 51.107.247.97     |
| UK South             | 51.143.213.211    |
| UK West              | 51.140.210.86     |
| West Central US      | 13.71.199.119     |
| West Europe          | 20.61.103.243, 20.61.103.244     |
| West US 2            | 20.51.13.80, 20.51.13.84, 20.51.13.85     |
| West US 3            | 20.150.245.165    |

> [!NOTE]
> The preceding steps are similar to the configuration steps in [Configure export settings and set up a storage account](./configure-export-data.md).

For private network access (that is, a private link), you can also disable the public network access to your Azure Container Registry instance. To do so:
1. In the Azure portal container registry, select **Networking**.
1. Select the **Public access** tab, select **Disabled**, and then select **Allow trusted Microsoft services to access this container registry**.

    ![Screenshot of the "Networking" pane for disabling public network access to an Azure Container Registry instance.](media/convert-data/configure-private-network-container-registry.png#lightbox)

### Verify the `$convert-data` operation

Make a call to the `$convert-data` API by specifying your template reference in the `templateCollectionReference` parameter:

`<RegistryServer>/<imageName>@<imageDigest>`

You should receive a `Bundle` response that contains the health data converted into the FHIR format.

## Next steps

In this article, you've learned about the `$convert-data` endpoint for converting health data to FHIR by using the FHIR service in Azure Health Data Services. For information about how to export FHIR data from the FHIR service, see:
 
>[!div class="nextstepaction"]
>[Export data](export-data.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7. 
