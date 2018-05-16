---
title: Azure Resource Manager template samples - Azure Container Instances
description: Azure Resource Manager template samples for Azure Container Instances
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 05/17/2018
ms.author: marsma
---

# Azure Resource Manager templates for Azure Container Instances

The following Azure Resource Manager templates deploy container instances in various configurations.

| | |
|-|-|
| **Applications** ||
| [Wordpress][app-wp] | Creates a WordPress website and its MySQL database in a container instance. The WordPress site content and MySQL database are persisted to an Azure Files share. |
| [MS NAV with SQL Server and IIS][app-nav] | Deploys a single Windows container with a fully featured self-contained Dynamics NAV / Dynamics 365 Business Central environment. |
| **Volumes** ||
| [emptyDir][vol-emptydir] | Deploys two Linux containers that share an emptyDir volume. |
| [gitRepo][vol-gitrepo] | Deploys a Linux container that clones a GitHub repo and mounts it as a volume. |
| [secret][vol-secret] | Deploys a Linux container with a PFX cert mounted as a secret volume. |
| **Networking** ||
| [UDP-exposed container][net-udp] | Deploys a Windows or Linux container that exposes a UDP port. |
| [Linux container with public IP][net-publicip] | Deploy a single Linux container accessible via a public IP. |
| **Azure resources** ||
| [Create Azure Storage account and Files share][az-files] | Uses the Azure CLI in a container instance to create a storage account and an Azure Files share.

## Deployment

[Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/resource-group-template-deploy-cli.md)

[Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/resource-group-template-deploy.md)

[Deploy resources with Resource Manager templates and Azure portal](../azure-resource-manager/resource-group-template-deploy-portal.md)

<!-- LINKS - External -->
[app-nav]: https://github.com/Azure/azure-quickstart-templates/tree/master/101-aci-dynamicsnav
[app-wp]: https://github.com/Azure/azure-quickstart-templates/tree/master/201-aci-wordpress
[az-files]: https://github.com/Azure/azure-quickstart-templates/tree/master/101-aci-storage-file-share
[net-publicip]: https://github.com/Azure/azure-quickstart-templates/tree/master/101-aci-linuxcontainer-public-ip
[net-udp]: https://github.com/Azure/azure-quickstart-templates/tree/master/201-aci-udp
[repo]: https://github.com/Azure/azure-quickstart-templates
[vol-emptydir]: https://github.com/Azure/azure-quickstart-templates/tree/master/201-aci-linuxcontainer-volume-emptydir
[vol-gitrepo]: https://github.com/Azure/azure-quickstart-templates/tree/master/201-aci-linuxcontainer-volume-gitrepo
[vol-secret]: https://github.com/Azure/azure-quickstart-templates/tree/master/201-aci-linuxcontainer-volume-secret
