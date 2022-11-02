---
title: Prepare your Azure container technical assets for a Kubernetes application
description: Technical resource and guidelines to help you configure a Kubernetes app container offer on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: nickomang
ms.author: nickoman
ms.date: 09/27/2022
---

# Prepare Azure container technical assets for a Kubernetes app

This article gives technical resources and recommendations to help you create a container offer on Azure Marketplace for a Kubernetes application.

For a comprehensive example of the technical assets required for a Kubernetes app-based Container offer, see [Azure Marketplace Container offer samples for Kubernetes][kubernetes-offer-samples].

## Fundamental technical knowledge

Designing, building, and testing these assets takes time and requires technical knowledge of both the Azure platform and the technologies used to build the offer.

In addition to your solution domain, your engineering team should have knowledge about the following Microsoft technologies:

- Basic understanding of [Azure Services](https://azure.microsoft.com/services/)
- How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/)
- Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
- Working knowledge of [JSON](https://www.json.org/)
- Working knowledge of [Helm](https://www.helm.sh)
- Working knowledge of [createUiDefinition][createuidefinition]
- Working knowledge of [Azure Resource Manager (ARM) templates][arm-template-overview]

## Prerequisites

- Your application must be Helm chart-based.

- All the image references and digest details must be included in the chart. No additional charts or images can be downloaded at runtime.

- You must have an active publishing tenant or access to a publishing tenant and Partner Center account.

- You must have created an Azure Container Registry (ACR) to which you'll upload the Cloud Native Application Bundle (CNAB), and give permission to Microsoft’s first party app ID to access your ACR. For more information, see [create an Azure Container Registry][create-acr].

- Install the latest version of the Azure CLI.

- The application must be deployable to Linux environment.

- If running the CNAB packaging tool manually, you will need docker installed on your local machine.

## Limitations

- Container Marketplace supports only Linux platform-based AMD64 images.
- Managed AKS only.
- Single containers are not supported.
- Linked Azure Resource Manager templates are not supported.

> [!IMPORTANT]
> The Kubernetes application-based offer experience is in preview. Preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. Previews are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use.

## Publishing overview

The first step to publish your Kubernetes app-based Container offer on the Azure Marketplace is to package your application as a [Cloud Native Application Bundle (CNAB)][cnab]. This CNAB, comprised of your application’s artifacts, will be first published to your private Azure Container Registry (ACR) and later pushed to an Azure Marketplace-specific public ACR and will be used as the single artifact you reference in Partner Center.

Once your offer is published, your application will leverage the [cluster extensions for AKS][cluster-extensions] feature to manage your application lifecycle inside an AKS cluster.

## Grant access to your Azure Container Registry

As part of the publishing process, Microsoft will deep copy your CNAB from your ACR to a Microsoft-owned, Azure Marketplace-specific ACR. This step requires you to grant Microsoft access to your registry.

Microsoft has created a first-party application responsible for handling this process with an `id` of `32597670-3e15-4def-8851-614ff48c1efa`. To begin, create a service principal based off of the application:


# [Linux](#tab/linux)

> [!NOTE]
> If your account doesn't have permission to create a service principal, `az ad sp create` will return an error message containing "Insufficient privileges to complete the operation". Contact your Azure Active Directory admin to create a service principal.


```azurecli-interactive
az login
az ad sp create --id 32597670-3e15-4def-8851-614ff48c1efa
```

Make note of the service principal's ID to use in the following steps.

Next, obtain your registry's full ID:

```azurecli-interactive
az acr show --name <registry-name> --query "id" --output tsv
```

Your output should look similar to the following:

```bash
...
},
"id": "/subscriptions/ffffffff-ff6d-ff22-77ff-ffffffffffff/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myregistry",
...
```

Next, create a role assignment to grant the service principal the ability to pull from your registry using the values you obtained earlier:

[!INCLUDE [Azure role assignment prerequisites](../../includes/role-based-access-control/prerequisites-role-assignments.md)]

```azurecli-interactive
az role assignment create --assignee <sp-id> --scope <registry-id> --role acrpull
```

Finally, register the `Microsoft.PartnerCenterIngestion` resource provider on the same subscription used to create the Azure Container Registry:

```azurecli
az provider register --namespace Microsoft.PartnerCenterIngestion --subscription <subscription-id> --wait
```

Monitor the registration and confirm it has completed before proceeding:

```azurecli-interactive
az provider show -n Microsoft.PartnerCenterIngestion --subscription <subscription-id>
```

# [Windows](#tab/windows)

> [!NOTE]
> If your account doesn't have permission to create a service principal, `New-AzADServicePrincipal` will return an error message containing "Insufficient privileges to complete the operation". Contact your Azure Active Directory admin to create a service principal.

```powershell-interactive
Connect-AzAccount
New-AzADServicePrincipal -ApplicationId 32597670-3e15-4def-8851-614ff48c1efa
```

Obtain the service principal's ID:

```powershell-interactive
Get-AzADServicePrincipal -SearchString "Container Marketplace Package App"
```

Make note of the service principal's ID to use in the following steps. 

Next, obtain your registry's full ID:

```powershell-interactive
Get-AzContainerRegistry -ResourceGroupName <resource-group> -Name <registry-name>
```

Your output should look similar to the following:

```bash
...
},
"id": "/subscriptions/ffffffff-ff6d-ff22-77ff-ffffffffffff/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myregistry",
...
```

Next, create a role assignment to grant the service principal the ability to pull from your registry:

[!INCLUDE [Azure role assignment prerequisites](../../includes/role-based-access-control/prerequisites-role-assignments.md)]

```powershell-interactive
New-AzRoleAssignment -ObjectId <sp-id> -Role acrpull -Scope <registry-id>
```

Finally, register the `Microsoft.PartnerCenterIngestion` resource provider on the same subscription used to create the Azure Container Registry:

```powershell-interactive
Connect-AzAccount
Select-AzSubscription -SubscriptionId <subscription-id>
Register-AzResourceProvider -ProviderNamespace Microsoft.PartnerCenterIngestion
```

Monitor the registration and confirm it has completed before proceeding:

```powershell-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.PartnerCenterIngestion
```

---

## Gather artifacts to meet the package format requirements

Each CNAB will be composed of the following artifacts:

- Helm chart

- CreateUiDefinition

- ARM Template

- Manifest file

### Update the Helm chart

Ensure the Helm chart adheres to the following rules:

- All image names and references are parameterized and represented in `values.yaml` as global.azure.images references. Update `deployment.yaml` to point these images. This ensures the image block can be updated and referenced by Azure Marketplace's ACR.

    :::image type="content" source="./media/azure-container/image-references.png" alt-text="A screenshot of a properly formatted deployment.yaml file is shown. The parameterized image references are shown, resembling the content in the sample deployment.yaml file linked in this article.":::

- If you have any subcharts, extract the content under charts and update each of your dependent image references to point to the images included in the main chart's `values.yaml`.

- Images must use digests instead of tags. This ensures CNAB building is deterministic.
    
    :::image type="content" source="./media/azure-container/billing-identifier.png" alt-text="A screenshot of a properly formatted values.yaml file is shown. The images are using digests. The content resembles the sample values.yaml file linked in this article.":::

### Make updates based on your billing model

After reviewing the billing models available, select one appropriate for your use case and complete the following steps:

- Add a billing identifier label and cpu cores request to your `deployment.yaml` file.

    :::image type="content" source="./media/azure-container/billing-identifier-label.png" alt-text="A screenshot of a properly formatted billing identifier label in a deployment.yaml file. The content resembles the sample depoyment.yaml file linked in this article":::

    :::image type="content" source="./media/azure-container/resources.png" alt-text="A screenshot of CPU resource requests in a deployment.yaml file. The content resembles the sample depoyment.yaml file linked in this article.":::

- Add a billing identifier value for `global.azure.billingidentifier` in `values.yaml`.

    :::image type="content" source="./media/azure-container/billing-identifier-value.png" alt-text="A screenshot of a properly formatted values.yaml file, showing the global > azure > billingIdentifier field.":::

Note that at deployment time, the cluster extensions feature will replace the billing identifier value with the extension type name you provide while setting up plan details.

For examples configured to deploy the [Azure Voting App][azure-voting-app], see the following:

- [Deployment file example][deployment-sample].
- [Values file example][values-sample].

### Validate the Helm chart

To ensure the Helm chart is valid, test that it's installable on a local cluster. You can also use `helm install --generate-name --dry-run --debug` to detect certain template generation errors.

### Create and test the createUiDefinition

A createUiDefinition is a JSON file that defines the user interface elements for the Azure portal when deploying the application. For more information, see [CreateUiDefinition.json for Azure][createuidefinition] or see an [example of a UI definition][ui-sample] that asks for input data for a new or existing cluster choice and passes parameters into your application.

After creating the createUiDefinition.json file for your application, you need to test the user experience. To simplify testing, use a [sandbox environment][sandbox-environment] that loads your file in the portal. The sandbox presents your user interface in the current, full-screen portal experience. The sandbox is the recommended way to preview the user interface.

### Create the Azure Resource Manager (ARM) template

An [ARM template][arm-template-overview] defines the Azure resources to deploy. You will be deploying a cluster extension resource for the Azure Marketplace application. Optionally, you can choose to deploy an AKS cluster.

We currently only allow the following resource types:

- `Microsoft.ContainerService/managedClusters`

- `Microsoft.KubernetesConfiguration/extensions`

For example, see this [sample ARM template][arm-template-sample] designed to take results from the sample UI definition linked above and pass parameters into your application.

### Create the manifest file

The package manifest is a yaml file that describes the package and its contents, and tells the packaging tool where to locate the dependent artifacts. 

The fields used in the manifest are as follows: 

|Name|Data Type|Description|
|-|-|-|
|applicationName|String|Name of the application| 
|publisher|String|Name of the Publisher|
|description|String|Short description of the package|
|version|SemVer string|SemVer string that describes the application package version, may or may not match the version of the binaries inside. Mapped to Porter’s version field|
|helmChart|String|Local directory where the Helm chart can be found relative to this `manifest.yaml`|
|clusterARMTemplate|String|Local path where an ARM template that describes an AKS cluster that meets the requirements in restrictions field can be found|
|uiDefinition|String|Local path where a JSON file that describes an Azure portal Create experience can be found|
|registryServer|String|The ACR where the final CNAB bundle should be pushed|
|extensionRegistrationParameters|Collection|Specification for the extension registration parameters. Include at least `defaultScope` and as a parameter.|
|defaultScope|String|The default scope for your extension installation. Accepted values are `cluster` or `namespace`. If `cluster` scope is set, then only one extension instance is allowed per cluster. If `namespace` scope is selected, then only one instance is allowed per namespace. As a Kubernetes cluster can have multiple namespaces, multiple instances of extension can exist.|
|namespace|String|(Optional) Specify the namespace the extension will install into. This property is required when `defaultScope` is set to `cluster`. For namespace naming restrictions, see [Namespaces and DNS][namespaces-and-dns].|

For a sample configured for the voting app, see the following [manifest file example][manifest-sample].

### Structure your application

Place the createUiDefinition, ARM template, and manifest file beside your application's Helm chart.

For an example of a properly structured directory, see [the sample repository][kubernetes-offer-sample-structure].

## Use the container packaging tool

Once you've added all the required artifacts, run the packaging tool `container-package-app`.

Since CNABs are a generally new format and have a learning curve, we've created a Docker image for `container-package-app` with bootstrapping environment and tools required to successfully run the packaging tool.

You have two options to use the packaging tool. You can use it manually or integrate it into a deployment pipeline.

### Manually run the packaging tool

The latest image of the packaging tool can be pulled from `mcr.microsoft.com/container-package-app:latest`.

The following Docker command pulls the latest packaging tool image and also mounts a directory.

# [Linux](#tab/linux)

Assuming `~\<path-to-content>` is a directory containing the contents to be packaged, the following docker command will mount `~/<path-to-content>` to `/data` in the container. Be sure to replace `~/<path-to-content>` with your own app's location.

```bash
docker run -it -v /var/run/docker.sock:/var/run/docker.sock -v ~/<path-to-content>:/data --entrypoint "/bin/bash" mcr.microsoft.com/container-package-app:latest 
```

# [Windows](#tab/windows)

Assuming `D:\<path-to-content>` is a directory containing the contents to be packaged, the following docker command will mount `d:/<path-to-content>` to `/data` in the container. Be sure to replace `d:/<path-to-content>` with your own app's location.

```bash
docker run -it -v /var/run/docker.sock:/var/run/docker.sock -v d:/<path-to-content>:/data --entrypoint "/bin/bash" mcr.microsoft.com/container-package-app:latest 
```

---

Run the following commands in the `container-package-app` container shell. Be sure to replace `<registry-name>` with the name of your ACR:

```bash
export REGISTRY_NAME=<registry-name>

az login 

az acr login -n $REGISTRY_NAME 

cd /data/<path-to-content>
```

Next, run `cpa verify` to iterate through the artifacts and validate them one by one. Address any failures, and run `cpa buildbundle` when you're ready to package and upload the CNAB to your Azure Container Registry. The `cpa buildbundle` command will also run the verification process before building.

```bash
cpa verify

cpa buildbundle 
```

> [!NOTE]
> Use `cpa buildbundle --force` only if you want to overwrite an existing tag. If you have already attach this CNAB to an Azure Marketplace offer, instead increment the version in the manifest file.

### Integrate into an Azure Pipeline

For an example of how to integrate `container-package-app` into an Azure Pipeline, see the [Azure Pipeline example][pipeline-sample].

## Next steps

- [Create your Kubernetes offer](azure-container-offer-setup.md)

<!-- LINKS -->

[cnab]: https://cnab.io/
[cluster-extensions]: ../aks/cluster-extensions.md
[azure-voting-app]: https://github.com/Azure-Samples/kubernetes-offer-samples/tree/main/samples/k8s-offer-azure-vote/azure-vote
[createuidefinition]: ../azure-resource-manager/managed-applications/create-uidefinition-overview.md
[sandbox-environment]: https://ms.portal.azure.com/#view/Microsoft_Azure_CreateUIDef/SandboxBlade
[arm-template-overview]: ../azure-resource-manager/templates/overview.md
[namespaces-and-dns]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#namespaces-and-dns
[create-acr]: ../container-registry/container-registry-get-started-azure-cli.md
[kubernetes-offer-samples]: https://github.com/Azure-Samples/kubernetes-offer-samples
[kubernetes-offer-sample-structure]: https://github.com/Azure-Samples/kubernetes-offer-samples/tree/main/samples/k8s-offer-azure-vote
[values-sample]: https://github.com/Azure-Samples/kubernetes-offer-samples/blob/main/samples/k8s-offer-azure-vote/azure-vote/values.yaml
[deployment-sample]: https://github.com/Azure-Samples/kubernetes-offer-samples/blob/main/samples/k8s-offer-azure-vote/azure-vote/templates/deployments.yaml
[ui-sample]: https://github.com/Azure-Samples/kubernetes-offer-samples/blob/main/samples/k8s-offer-azure-vote/createUIDefinition.json
[pipeline-sample]: https://github.com/Azure-Samples/kubernetes-offer-samples/tree/main/samples/.pipelines/AzurePipelines/azure-pipelines.yml
[arm-template-sample]: https://github.com/Azure-Samples/kubernetes-offer-samples/blob/main/samples/k8s-offer-azure-vote/mainTemplate.json
[manifest-sample]: https://github.com/Azure-Samples/kubernetes-offer-samples/blob/main/samples/k8s-offer-azure-vote/manifest.yaml