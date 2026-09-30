---
title: Configure $convert-data Settings for Azure FHIR Service
description: Configure $convert-data settings in Azure FHIR Service to convert healthcare data to FHIR R4 format. Learn the steps to set up templates using the Azure portal.
author: EXPEkesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 08/14/2026
ms.author: kesheth
ai-usage: ai-assisted
---

# Configure settings for $convert-data using the Azure portal

This article shows how to configure settings for `$convert-data` by using the Azure portal to convert health data into [FHIR&reg; R4](https://www.hl7.org/fhir/R4/index.html).

## Default templates

Microsoft publishes a set of predefined sample Liquid templates from the FHIR Converter project to support FHIR data conversion. These templates help you get started with your data conversion workflow. Customize and host your own templates to support your own data conversion requirements. For information on customized templates, see [Customize templates](#customize-templates).
    
The default templates are hosted in a public container registry and require no further configurations or settings for your FHIR service.
To access and use the default templates for your conversion requests, ensure that when invoking the `$convert-data` operation, the `templateCollectionReference` request parameter has the appropriate value based on the type of data input. 

* [HL7v2 templates](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates/Hl7v2)
* [C-CDA templates](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates/Ccda)
* [JSON templates](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates/Json)
* [FHIR STU3 templates](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates/Stu3ToR4)

> [!WARNING]
> Microsoft releases default templates under the MIT License and *doesn't* support them.
>
> The default templates help you get started with your data conversion workflow. These default templates aren't intended for production and might change when Microsoft releases updates for the FHIR service. To have consistent data conversion behavior across different versions of the FHIR service host your own copy of the templates in an [Azure Container Registry (ACR)](/azure/container-registry/container-registry-intro) instance. Use ACR to host your custom templates and support versioning.
> 
> For more information on hosting your own templates, see [Host your own templates](convert-data-configuration.md#host-your-own-templates). 

## Customize templates

Use the [FHIR Converter Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to customize templates for your specific requirements. The extension provides an interactive editing experience and makes it easy to download Microsoft-published templates and sample data.

> [!NOTE]
> The FHIR Converter extension for Visual Studio Code supports HL7v2, C-CDA, and JSON Liquid templates. It doesn't currently support FHIR STU3 to FHIR R4 Liquid templates.

Use the default templates as a starting point, and add your customizations. To avoid unintended conversion results, follow these guidelines when updating the templates.

Author the template so that it yields a valid structure for a FHIR bundle resource. 

For example, the Liquid templates should have a format such as the following code:

```json
<liquid assignment line 1 >
<liquid assignment line 2 >
.
.
<liquid assignment line n >	          
{
    "resourceType": "Bundle",
    "type": "xxx",
    <...liquid code...>
    "identifier":
    {
        "value":"xxxxx",
    },
    "id":"xxxx",
    "entry": [
	<...liquid code...>
   ]
}
```

The overall template follows the structure and expectations for a FHIR bundle resource, with the FHIR bundle JSON at the root of the file. If you add custom fields to the template that aren't part of the FHIR specification for a bundle resource, the conversion request could fail. However, the converted result could potentially have unexpected output, and wouldn't yield a valid FHIR bundle resource that the FHIR service can persist as is.

For example, consider the following code:

```json
<liquid assignment line 1 >
<liquid assignment line 2 >
.
.
<liquid assignment line n >	          
{
   “customfield_message”: “I will have a message here”,
    “customfield_data”: {
      "resourceType": "Bundle",
      "type": "xxx",
      <...liquid code...>
      "identifier":
      {
        "value":"xxxxx",
      },
       "id":"xxxx",
       "entry": [
	  <...liquid code...>
    ]
  }
}
```

In the example code, two example custom fields `customfield_message` and `customfield_data` aren't FHIR properties per the specification, and the FHIR bundle resource seems to be nested under `customfield_data` (that is, the FHIR bundle JSON isn't at the root of the file). This template doesn't align with the expected structure around a FHIR bundle resource. The conversion request might succeed by using the provided template. However, the returned converted result could potentially have unexpected output (due to certain post conversion processing steps being skipped). It wouldn't be considered a valid FHIR bundle (since it's nested and has non FHIR specification properties) and attempting to persist the result in your FHIR service fails.
 
## Host your own templates

Host your own copy of templates in an [Azure Container Registry (ACR)](/azure/container-registry/container-registry-intro) instance. Use ACR to host your custom templates and support versioning.

To host your own templates and use them for `$convert-data` operations, follow these seven steps:

1. [Create an Azure Container Registry instance](#step-1-create-an-azure-container-registry-instance)
1. [Push the templates to your Azure Container Registry instance](#step-2-push-the-templates-to-your-azure-container-registry-instance)
1. [Enable Azure Managed identity in your FHIR service instance](#step-3-enable-azure-managed-identity-in-your-fhir-service-instance)
1. [Provide Azure Container Registry access to the FHIR service managed identity](#step-4-provide-azure-container-registry-access-to-the-fhir-service-managed-identity)
1. [Register the Azure Container Registry server in the FHIR service](#step-5-register-the-azure-container-registry-server-in-the-fhir-service)
1. [Configure the Azure Container Registry firewall for secure access](#step-6-configure-the-azure-container-registry-firewall-for-secure-access)
1. [Verify the $convert-data operation](#step-7-verify-the-convert-data-operation)

### Step 1: Create an Azure Container Registry instance

Read the [Introduction to container registries in Azure](/azure/container-registry/container-registry-intro) and follow the instructions for creating your own ACR instance. Place your ACR instance in the same resource group as your FHIR service.

### Step 2: Push the templates to your Azure Container Registry instance

After you create an ACR instance, use the **FHIR Converter: Push Templates** command in the [FHIR Converter extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to push your custom templates to your ACR instance. Alternatively, you can use the [Template Management CLI tool](https://github.com/microsoft/FHIR-Converter/blob/main/docs/TemplateManagementCLI.md) for this purpose.

To maintain different versions of custom templates in your Azure Container Registry, push the image containing your custom templates into your ACR instance with different image tags. 
* For more information about ACR registries, repositories, and artifacts, see [About registries, repositories, and artifacts](/azure/container-registry/container-registry-concepts).
* For more information about image tag best practices, see [Recommendations for tagging and versioning container images](/azure/container-registry/container-registry-image-tag-version).

To reference specific template versions in the API, use the exact image name and tag that contains the versioned template to be used. For the API parameter `templateCollectionReference`, use the appropriate **image name + tag** (for example: `<RegistryServer>/<imageName>:<imageTag>`).

### Step 3: Enable Azure Managed identity in your FHIR service instance

1. Go to your instance of the FHIR service in the Azure portal, and then select the **Identity** option.

1. Change the **Status** to **On** and select **Save** to enable the system-managed identity in the FHIR service.

### Step 4: Provide Azure Container Registry access to the FHIR service managed identity

1. In your resource group, go to your **Container Registry** instance, and then select the **Access control (IAM)** tab.

1. Select **Add** > **Add role assignment**. If the **Add role assignment** option is unavailable, ask your Azure administrator to grant you the permissions for performing this task.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-menu-generic.png" alt-text="Screenshot of the Access control pane and the Add role assignment menu.":::

1. On the **Role** pane, select the [AcrPull](../../role-based-access-control/built-in-roles.md#acrpull) role.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-page.png" alt-text="Screenshot of the Add role assignment pane." lightbox="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-page.png"::: 

1. On the **Members** tab, select **Managed identity**, and then **Select members**.

1. Select your Azure subscription.

1. Select **System-assigned managed identity**, and then select the FHIR service you're working with.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

For more information about assigning roles in the Azure portal, see [Azure built-in roles](/azure/role-based-access-control/role-assignments-portal).

### Step 5: Register the Azure Container Registry server in the FHIR service

Register the ACR server by using the Azure portal.

To use the Azure portal:

1. In your FHIR service instance, under **Transfer and transform data**, select **Artifacts**. You see a list of currently registered Azure Container Registry servers. 
1. Select **Add** and then, in the dropdown list, select your registry server. 
1. Select **Save**. 

You can register up to 20 ACR servers in the FHIR service.

> [!NOTE]
> It might take a few minutes for the registration to take effect.

> [!IMPORTANT]
> When registering an Azure Container Registry (ACR) image in the FHIR service:
>  - If you specify a _digest_, the service uses only the image with the exact digest.
>  - If you don't specify a _digest_, the service can resolve the image by using both tagging and digest.

### Step 6: Configure the Azure Container Registry firewall for secure access

Secure ACR by using the built-in firewall. The best method depends on your particular use case. For more information, see:

* [Connect privately to an Azure container registry using Azure Private Link](/azure/container-registry/container-registry-private-link)
* [Configure public IP network rules](/azure/container-registry/container-registry-access-selected-networks)
* [Azure Container Registry mitigating data exfiltration with dedicated data endpoints](/azure/container-registry/container-registry-dedicated-data-endpoints)
* [Restrict access to a container registry using a service endpoint in an Azure virtual network](/azure/container-registry/container-registry-vnet)
* [Allow trusted services to securely access a network-restricted container registry](/azure/container-registry/allow-access-trusted-services)
* [Configure rules to access an Azure container registry behind a firewall](/azure/container-registry/container-registry-firewall-access-rules)
* [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519)


> [!NOTE]
> The FHIR service is registered as a trusted Microsoft service with Azure Container Registry.

### Step 7: Verify the $convert-data operation

Call the `$convert-data` operation by specifying your template reference in the `templateCollectionReference` parameter:

`<RegistryServer>/<imageName>@<imageDigest>`.

You receive a `bundle` response that contains the health data converted into the FHIR format.

## Related articles

- [Overview of $convert-data](convert-data-overview.md)
- [Troubleshoot $convert-data](convert-data-troubleshoot.md)
- [$convert-data FAQ](convert-data-faq.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
