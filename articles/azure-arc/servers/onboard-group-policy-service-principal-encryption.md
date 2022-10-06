---
title: Connect machines at scale using Group Policy with a PowerShell script
description: In this article, you learn how to create a Group Policy Object to onboard Active Directory-joined Windows machines to Azure Arc-enabled servers.
ms.date: 07/20/2022
ms.topic: conceptual
ms.custom: template-how-to
---

# Create a Group Policy Object for onboarding with a PowerShell script

You can onboard Active Directory–joined Windows machines to Azure Arc-enabled servers at scale using Group Policy.

You'll first need to set up a local remote share with the Connected Machine agent and modify a script specifying the Arc-enabled server's landing zone within Azure. You'll then run a script that generates a Group Policy Object (GPO) to onboard a group of machines to Azure Arc-enabled servers. This Group Policy Object can be applied to the site, domain, or organizational level. Assignment can also use Access Control List (ACL) and other security filtering native to Group Policy. Machines in the scope of the Group Policy will be onboarded to Azure Arc-enabled servers. Scope your GPO to only include machines that you want to onboard to Azure Arc.

Before you get started, be sure to review the [prerequisites](prerequisites.md) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions). Also review our [at-scale planning guide](plan-at-scale-deployment.md) to understand the design and deployment criteria, as well as our management and monitoring recommendations.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prepare a remote share and create a service principal

The Group Policy Object, which is used to onboard Azure Arc-enabled servers, requires a remote share with the Connected Machine agent. You will need to:

1. Prepare a remote share to host the Azure Connected Machine agent package for Windows and the configuration file. You need to be able to add files to the distributed location. The network share should provide Domain Controllers, Domain Computers, and Domain Admins with Change permissions.

1. Follow the steps to [create a service principal for onboarding at scale](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).

    * Assign the Azure Connected Machine Onboarding role to your service principal and limit the scope of the role to the target Azure landing zone.
    * Make a note of the Service Principal Secret; you'll need this value later.

1. For each of the scripts below, click to go to its GitHub directory and download the raw script to your local share using your browser's **Save as** function:
    * [`EnableAzureArc.ps1`](https://raw.githubusercontent.com/Azure/ArcEnabledServersGroupPolicy/main/EnableAzureArc.ps1)
    * [`DeployGPO.ps1`](https://raw.githubusercontent.com/Azure/ArcEnabledServersGroupPolicy/main/DeployGPO.ps1)
    * [`AzureArcDeployment.psm1`](https://raw.githubusercontent.com/Azure/ArcEnabledServersGroupPolicy/main/AzureArcDeployment.psm1)

    > [!NOTE]
    > The ArcGPO folder must be in the same directory as the downloaded script files above. The ArcGPO folder contains the files that define the Group Policy Object that's created when the DeployGPO script is run. When running the DeployGPO script, make sure you're in the same directory as the ps1 files and ArcGPO folder.

1. Modify the script `EnableAzureArc.ps1` by providing the parameter declarations for servicePrincipalClientId, tenantId, subscriptionId, ResourceGroup, Location, Tags, and ReportServerFQDN fields respectively.

1. Execute the deployment script `DeployGPO.ps1`, modifying the run parameters for the DomainFQDN, ReportServerFQDN, ArcRemoteShare, AgentProxy (if applicable), and Service Principal secret:

   ```
   .\DeployGPO.ps1 -DomainFQDN <INSERT Domain FQDN> -ReportServerFQDN <INSERT Domain FQDN of Network Share> -ArcRemoteShare <INSERT Name of Network Share> -Spsecret <INSERT SPN SECRET> [-AgentProxy $AgentProxy]
    ```

1. Download the latest version of the [Azure Connected Machine agent Windows Installer package](https://aka.ms/AzureConnectedMachineAgent) from the Microsoft Download Center and save it to the remote share.

## Apply the Group Policy Object

On the Group Policy Management Console (GPMC), right-click on the desired Organizational Unit and link the GPO named **[MSFT] Azure Arc Servers (datetime)**. This is the Group Policy Object which has the Scheduled Task to onboard the machines. After 10 or 20 minutes, the Group Policy Object will be replicated to the respective domain controllers. Learn more about [creating and managing group policy in Azure AD Domain Services](../../active-directory-domain-services/manage-group-policy.md).

After you have successfully installed the agent and configured it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the servers in your Organizational Unit have successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal).

## Next steps

* Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
* Review connection troubleshooting information in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).
* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md) for such things as VM [guest configuration](../../governance/machine-configuration/overview.md), verifying that the machine is reporting to the expected Log Analytics workspace, enabling monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.
* Learn more about [Group Policy](/troubleshoot/windows-server/group-policy/group-policy-overview).
