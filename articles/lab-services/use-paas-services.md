---
title: Use Platform-as-a-Service (PaaS) services in Azure DevTest Labs | Microsoft Docs
description: Learn how to use Platform-as-a-Service (Pass) services in Azure DevTest Labs. 
services: devtest-lab,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/02/2019
ms.author: spelluru

---

# Use Platform-as-a-Service (PaaS) services in Azure DevTest Labs
PaaS is supported in DevTest Labs via environments. DevTest Labs environments are important in today’s enterprise ecosystem. They allow creation of complex systems that can include any Azure resources like, virtual machines, databases, virtual networks, and Web apps, that are customized to work together. These environments are stored as code (Azure Resource Manager templates), which allows consistent behavior and improved management using source code control. 

A properly set up system allows the following scenarios: 

- Developers to have independent and concurrent environments
- Testing on different configurations asynchronously
- Integration into staging and production pipelines without any template changes
- Having both development machines and environments within the same lab improves ease of management and cost reporting.  

## PaaS in environments
PaaS services are supported in DevTest Labs within the [environment](devtest-lab-create-environment-from-arm.md) feature. Environments in DevTest Labs are supported by pre-configured Azure Resource Manager templates. It's important to note that environments are sandboxed, with only a couple of exceptions. Environments can contain both PaaS and IaaS resources. The DevTest Labs resource provider creates resources on the lab user’s behalf, so no extra permissions need to be given to the lab user to enable use of the PaaS resources. The following image shows a Service Fabric cluster as an environment in the lab.

![Service Fabric cluster as an environment](./media/create-environment-service-fabric-cluster/cluster-created.png)

> [!NOTE]
> For for more information on how you can set up environments, see [Configure and use public environments in Azure DevTest Labs](devtest-lab-configure-use-public-environments.md).   

## Configure environments that Use PaaS resources
 For instructions on how to allow a lab access to Azure Resource Manager templates that use PaaS services, see [Create multi-VM environments and PaaS resources with Azure Resource Manager templates](devtest-lab-create-environment-from-arm.md). For examples on how to create such templates, see [DevTest Labs public environments](devtest-lab-configure-use-public-environments.md) . The template code is available at [https://github.com/Azure/azure-devtestlab/tree/master/Environments])(https://github.com/Azure/azure-devtestlab/tree/master/Environments). 

In large organizations, development teams typically provide environments such as customized/isolated testing environments. There may be environments that are to be used by all teams within a business unit or a division. The IT group may want to provide their environments that can be used by all the teams in the organization.  

## DevTest Labs environments
As mentioned earlier, by default, environments can only create or get information from resources within the resource group in which they're created. The resources are created based on the Azure Resource Manager templates in the repository.

## Customizations

#### Sandbox 
The lab owner can customize lab environments to change the user’s role from reader to contributor within the resource group. This capability is in the **Lab Settings** page under the **Configuration and Policies** of the lab. This change in role allows the user to add or remove resources within that environment. If you want to restrict the access further, use Azure policies. This functionality allows the user to customize the resources or configuration without have access at the subscription level.

#### Custom tokens
There's some custom lab information that the template has access to that is outside of the resource group and is specific to environments. Here are some of them: 

- Lab network identification
- Location
- Storage account in which the Resource Manager templates files are stored. 
 
#### Lab virtual network
The [Connecting environments to the lab's virtual network](connect-environment-lab-virtual-network.md) article describes how to modify your Resource Manager template to use the `$(LabSubnetId)` token. When an environment is created, the `$(LabSubnetId)` token is replaced by the first subnet mark where the **use in virtual machine create** option is set to **true**. It allows our environment to use previously created networks. If you want to use the same Resource Manager templates in environments in test as staging and production, we recommend that you use `$(LabSubnetId)` as a default value in a Resource Manager template parameter as show in the example in the article mentioned in this section. 

#### Environment Storage Account
DevTest Labs supports the use of [nested Resource Manager templates](../azure-resource-manager/resource-group-linked-templates.md). The [How Azure DevTest Labs makes nested Resource Manager template deployments easier for testing environments](https://azure.microsoft.com/updates/azure-devtest-labs-streamlined-nested-arm-template-deployment-support-for-arm-template-based-environments) explains how the use of the `_artifactsLocation` and `_artifactsLocationSasToken` can be used to create a URI to a Resource Manager template in the same folder as or a nested folder of the main template.  For more information about these two tokens, see the **Deployment artifacts** section of [Azure Resource Manager – Best Practices Guide](https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/best-practices.md).

## User Experience

## Developer
Developers use the same workflow for creating a VM to create a specific environment. They select the environment vs. the machine image and enter the necessary information required by the template. Each developer having an environment allows for deployment of changes and improved inner loop debugging. The environment can be created at any time using the latest template.  This feature allows the environments to be destroyed and recreated to help reduce the downtime from having to manually creating the system or recovering from fault testing.  

### Testing
DevTest Labs environments allow for independent testing of specific code and configurations asynchronously. The common practice is to set up the environment with the code from the individual pull request and start any automated testing. Once the automated testing has run to completion, any manual testing can be executed against the specific environment. Usually this process is done as part of the CI/CD pipeline. 

## Management Experience

### Cost Tracking
DevTest Labs cost tracking feature includes Azure resources within the different environments as a portion of the overall cost trend. The cost by resources doesn't break out the different resources within the environment but displays the environment as a single cost.

### Security
A properly configured Azure subscription with DevTest Labs can [limit access to Azure resources only through the lab](devtest-lab-add-devtest-user.md). With environments, a lab owner can allow users to access PaaS resources with approved configurations without allowing access to any other Azure resources. In the scenario where lab users are customizing the environments, the lab owner can allow contributor access, which allows the lab user to add or remove Azure resource only within the managed resource group. It allows for easier tracking and management versus allow the user contributor access to the subscription.

### Automation
Automation is a key component for a large scale, effective ecosystem. Automation is necessary to handle managing or tracking multiple environments across subscriptions and labs.

### CI/CD Pipeline
PaaS services in DevTest Labs can help improve the CI/CD pipeline by having focused deployments where access is controlled by the lab.





