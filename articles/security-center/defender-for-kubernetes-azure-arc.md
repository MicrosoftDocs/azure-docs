---
title: Benefits of Azure Defender for Arc enabled Kubernetes
description: Learn how to secure your Arc enabled Kubernetes clusters with Azure Defender for Kubernetes
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 01/19/2021
ms.author: memildin

---

# Azure Defender for Arc enabled Kubernetes

## Availability

|Aspect|Details|
|----|:----|
|Release state:|**Preview**|
|Required roles and permissions:|**Security admin** can dismiss alerts<br>**Security reader** can view findings|
|Supported Kubernetes distributions:|[Kubernetes](https://kubernetes.io/docs/home/)<br>[AKS Engine](https://github.com/Azure/aks-engine)<br>[OpenShift (version 4 and higher)](https://github.com/openshift/kubernetes)|
|||

## Description

Azure Defender for Kubernetes is expanding its support from Azure Kubernetes Service to *any* Kubernetes cluster, leveraging Azure Arc for Kubernetes.

This preview brings the management layer threat detection capabilities that Azure Security Center offers today (through Azure Defender for Kubernetes) to Arc connected Kubernetes clusters.


- [Azure Security Center enabled on your designated subscription](https://docs.microsoft.com/azure/security-center/security-center-get-started#enable-security-center-on-your-azure-subscription).


## Architecture overview

Azure Defender for Kubernetes' ability to monitor and provide threat protection capabilities relies on an Azure Arc extension. The extension collects Kubernetes audit logs data from all control plane (master) nodes in the cluster and sends them to the Azure Defender for Kubernetes backend in the cloud for further analysis. The extension is registered with a Log Analytics workspace that's used as a data pipeline. The audit log data isn't stored in the Log Analytics workspace.

This is a high-level diagram outlining the interaction between Azure Defender for Kubernetes and the Azure Arc-enabled Kubernetes cluster:

:::image type="content" source="media/defender-for-kubernetes-azure-arc/defender-for-kubernetes-architecture-overview.png" alt-text="A high-level architecture diagram outlining the interaction between Azure Defender for Kubernetes and an Azure Arc enabled Kubernetes clusters.":::

## Get started

> [!IMPORTANT]
> The instructions in this section use Azure CLI and should be run from a Linux machine (or [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/windows/wsl/install-win10)) that has the kubeconfig of your Arc connected cluster.

### Step 1 - Prepare the environment

1. Using the following command, verify that you have version 2.12.0 (or newer) of Azure CLI:

    ``az -v``

    If you don't have Azure CLI, or need to upgrade, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

1. As mentioned in the prerequisites, you'll need a Kubernetes cluster. If you need to set one up, do so at this stage.

1. To verify that your control plane (master) nodes are labelled "node-role.kubernetes.io/master" (this is the Kubernetes default), run the following command on your control plane (master) nodes:

    ``kubectl get nodes --show-labels``

    > [!NOTE]
    > To label your control plane (master) node, run the following command:
    >
    > ``kubectl label node <NODE-NAME> node-role.kubernetes.io/master``

1. Optionally, if you're using a proxy or firewall verify that port 443 is enabled for outbound communication. This is required for the Azure Arc extension to communicate with the Azure Defender service backend.

1. To establish the required configuration and settings for the Azure Arc extension, run the following commands:

    ``az login``

    ``az account set --subscription <subscription-id>``

    ``wget -O- https://azuredefenderforarc.blob.core.windows.net/azuredefenderforarc/InstallAzureDefenderExtension.Prerequisites.sh | bash``

1. If your cluster is already connected to Arc (public preview version), [disconnect it](https://docs.microsoft.com/azure/azure-arc/kubernetes/connect-cluster#delete-a-connected-cluster) before continuing.

    > [!TIP]
    > This Azure Defender preview requires a private preview version of Azure Arc to support extension installation. Therefore, the cluster must be connected with the version established by the script downloaded in the previous instruction.

1. Connect your Kubernetes cluster to Arc as described in [Connect an Azure Arc-enabled Kubernetes cluster](https://docs.microsoft.com/azure/azure-arc/kubernetes/connect-cluster#before-you-begin).


### Step 2 - Default installation of the Arc extension for Azure Defender

For the default deployment of this extension to your Kubernetes cluster, follow the instructions in this section.

If you want to change any defaults, for example to configure a proxy endpoint or a dedicated Log Analytics workspace, use the [Advanced installation](#advanced-installation) procedure.

1. To deploy the extension:

    - For a Kubernetes or AKS-Engine cluster, run the following command: ``az k8s-extension create --cluster-type connectedClusters --cluster-name <your-cluster-name> --resource-group <your-rg> --extension-type microsoft.azuredefender.kubernetes --name microsoft.azuredefender.kubernetes``

    - For an OpenShift cluster, run the following command: ``az k8s-extension create --cluster-type connectedClusters --cluster-name <your-cluster-name> --resource-group <your-rg> --extension-type microsoft.azuredefender.kubernetes --name microsoft.azuredefender.kubernetes --configuration-settings Azure.Cluster.kubernetesDistro="openshift"``

    Where:

    - **your-cluster-name** - Your Arc connected cluster name
    - **your-rg** - Your Arc connected cluster resource group

    If you want to specify advanced options like a proxy endpoint or details of your own Log Analytics workspace, see [Advanced installation](#advanced-installation).

    > [!IMPORTANT]
    > The process may take a few minutes to complete, so we recommend waiting before moving on to installation verification.

1. To verify that the installation was successful:

    1. Run the following command and under "extensionType": "microsoft.azuredefender.kubernetes", look for "installState": "Installed" (it might show "installState": "pending" for the first few minutes):

        ``az k8s-extension show --cluster-type connectedClusters --cluster-name <your-cluster-name> --resource-group <your-rg> --name microsoft.azuredefender.kubernetes``

    1. Run the following command and check that a pod called "azuredefender-XXXXX" is running:

        ``kubectl get pods -n azuredefender``

### Advanced installation

For a simple installation using the default options, follow the instructions in [Step 2 - Default installation of the Arc extension for Azure Defender](#step-2---default-installation-of-the-arc-extension-for-azure-defender). To configure advanced options like a proxy endpoint or details of your own Log Analytics workspace, use the instructions below.

1. To provide runtime threat protection capabilities, the extension collects [Kubernetes audit logs](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) from your cluster. To validate you Kubernetes audit logs are configured correctly:

    - If you haven't enabled audit logs, they'll automatically be enabled during the installation of the Azure Arc extension. When audit logs are automatically enabled in your cluster, a backup of the kube-apiserver.yaml file is generated to provide you with a rollback option. The backup will be saved at ``/var/log/kube-apiserver.yaml.backup``.

    - If you've already enabled audit logs, use this policy file to verify that you're collecting the necessary events for the Arc extension for Azure Defender for Kubernetes: [audit_policy.yaml](https://github.com/Azure/Azure-Security-Center/blob/master/Pricing%20%26%20Settings/Defender%20for%20Kubernetes/audit-policy.yaml).

    - When audit logs are already enabled on your cluster, your cluster's audit configuration and settings won't be modified during the installation of the extension.

    > [!NOTE]
    > In OpenShift and AKS Engine based clusters, audit logs are enabled by default. For both of these systems the audit configuration and settings won't be modified.

1. Optionally, configure a dedicated Log Analytics workspace:

    Log Analytics workspaces provide a robust and secure data pipeline. Security data collected from your cluster is sent by the extension to the Azure defender for Kubernetes service in Azure for analysis. The transfer utilizes a Log analytics workspace.

    > [!IMPORTANT]
    > The data collected will **not** be stored in this workspace **nor will you be charged for it**.

    - To use your own workspace, enter the full Azure resource ID during the installation of the Azure Defender for Kubernetes Azure Arc extension. To get the full resource ID, run the following command to display the list of workspaces in your subscriptions in the default JSON format:

        ``az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json``

        In the output, find the designated workspace name, and then copy the full resource ID of that Log Analytics workspace. Keep it available for use when running the ``create`` command below.

    - You can create a new workspace using [Azure Resource Manager](https://docs.microsoft.com/azure/azure-monitor/samples/resource-manager-workspace), [PowerShell](https://docs.microsoft.com/azure/azure-monitor/scripts/powershell-sample-create-workspace?toc=/powershell/module/toc.json), or the [Azure portal](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).

    - If you don't supply details of your own workspace, the Arc extension will connect to the default Log Analytics workspace of your resource group’s region. If one doesn’t exist in the region, it will be created (at no additional cost).

1. Optionally, configure a proxy endpoint:

    You can configure the extension to communicate through your outbound HTTP/HTTPS proxy server. Both anonymous and basic authentication (username/password) are supported. At this time, certificate based auth proxy servers are not supported.

    The proxy configuration uses the syntax ``protocol://user:password@proxyhost:port`` and is entered in the ``create`` command in the next instruction below.

    > [!IMPORTANT]
    > If your proxy server does not require authentication, you still need to specify a pseudo username/password. This can be any username or password.

    |Property|Description|
    |----|:----|
    | Protocol | http or https |
    | user | Optional username for proxy authentication |
    | password | Optional password for proxy authentication |
    | proxyhost | Address or FQDN of the proxy server |
    | port | Optional port number for the proxy server |
    |||

    For example: ``http://user01:password@proxy01.contoso.com:3128``

    If you specify the protocol as **http**, the HTTP requests are created using SSL/TLS secure connection. Your proxy server must support SSL/TLS protocols.

1. To deploy the Azure Arc extension (consult the table for details of the properties):

    ``az k8s-extension create --cluster-type connectedClusters --cluster-name <your-cluster-name> --resource-group <your-rg> --extension-type microsoft.azuredefender.kubernetes --name microsoft.azuredefender.kubernetes --configuration-settings logAnalyticsWorkspaceResourceID=<log-analytics-workspace-resource-id> auditLogPath=<your-auditlog-path> Azure.Cluster.kubernetesDistro=<your-kubernetes-distribution> --configuration-protected-settings proxyEndpoint=<your-proxy-endpoint>``

    |Property|Description|
    |----|:----|
    |cluster-name|Your Arc connected cluster name.|
    |resource-group|Your Arc connected cluster resource group.|
    |logAnalyticsWorkspaceResourceID|**Optional**. Full resource ID of your own Log Analytics workspace. When not provided, the default workspace of the region will be used.|
    |proxyEndpoint|**Optional**. The proxy endpoint configuration value with the following syntax:<br>protocol://user:password@proxyhost:port as described in the previous instruction.<br><br>**proxyEndpoint** is only allowed in **--configuration-protected-settings** since it can have credentials in it. Unlike configuration settings, configuration protected settings are NOT returned in GET and LIST responses, and thus not exposed after they are set during the creation of extension.|
    |auditLogPath|**Optional**. The full path to the audit log files. The default value is ``/var/log/kube-apiserver/audit`` as the auto enablement of audit logs configures this path.|
    |Azure.Cluster.kubernetesDistro|**Optional**. If your Arc connected cluster is OpenShift, specify "OpenShift". Otherwise, this property is ignored.|
    |||

    > [!IMPORTANT]
    > The process may take a few minutes to complete, so we recommend waiting before moving on to installation verification.

1. To verify that the installation was successful:

    1. Run the following command and under "extensionType": "microsoft.azuredefender.kubernetes", look for "installState": "Installed" (it might show "installState": "pending" for the first few minutes):

        ``az k8s-extension show --cluster-type connectedClusters --cluster-name <your-cluster-name> --resource-group <your-rg> --name microsoft.azuredefender.kubernetes``

    1. Run the following command and check that a pod called "azuredefender-XXXXX" is running:

        ``kubectl get pods -n azuredefender``

## Simulate security alerts from Azure Defender for Kubernetes

A full list of supported alerts is available in the [Reference table for all security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-akscluster). You can simulate security alerts using the instructions below.

1. To simulate an Azure Defender alert, run the following command:

    ``kubectl get pods --namespace=asc-alerttest-662jfi039n``

    The expected response is "No resource found".

    Within 30 minutes, Azure Defender will detect this activity and trigger a security alert.

1. To optionally simulate malicious-like deployment, run the following command:

    ``kubectl create -f https://azuredefenderforarc.blob.core.windows.net/azuredefenderforarc/AzureDefender-Trigger-K8S-Alerts.yaml``

    Within 30 minutes, Azure Defender will detect this activity and trigger a security alert.

    > [!TIP]
    > To delete this deployment after your tests, run the following command:
    > 
    > ``kubectl delete -f https://azuredefenderforarc.blob.core.windows.net/azuredefenderforarc/AzureDefender-Trigger-K8S-Alerts.yaml``

1. In the Azure portal, open Azure Security Center's security alerts page:

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/sample-kubernetes-security-alert.png" alt-text="Sample alert from Azure Defender for Kubernetes.":::

    > [!TIP]
    > This screenshot shows the recently released security alerts experience. Try it out!

## Uninstall the Arc extension

1. To remove the Azure Defender for Kubernetes Arc extension with Azure CLI, run the following commands on your Arc enabled Kubernetes cluster:

    ``az login``

    ``az account set --subscription <subscription-id>``

    ``az k8s-extension delete --cluster-type connectedClusters --cluster-name <your-cluster-name> --resource-group <your-rg> --name microsoft.azuredefender.kubernetes --yes``

    > [!IMPORTANT]
    > The uninstallation process might take a few minutes to complete. We recommend you wait before you try to verify that it was successful.

1. To verify that the extension was successfully removed, run the following commands:

    ``az k8s-extension show --cluster-type connectedClusters --cluster-name <your-cluster-name> --resource-group <your-rg> --name microsoft.azuredefender.kubernetes``

    Verify the extension does not exist - there should be no delay.

    ``kubectl get pods -n azuredefender``

    Validate that there are no pods called "azuredefender-XXXXX". It might take a few minutes for the pods to be deleted.

## Feedback

Please share your feedback, specifically in the areas below. You can submit your feedback via this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR29qPXYA7fJFpXjPCSwLwsNUQjA1R0FaTFBUMzRNODJBRUVGN1hQTkZGWS4u) or directly to the key contacts below.

### Participant Information

1. Please supply your name
1. Organization
1. Email address (If you are open to being contacted about your feedback)
1. Your role within the organization

### Feature feedback questions

1. On which Kubernetes distribution did you test this private preview (e.g. OpenShift, AKS-Engine, Kubernetes)? Are there other Kubernetes distributions your organization might be interested in protecting with Azure Defender for Kubernetes?
1. Is your Arc enabled Kubernetes behind a proxy service? If yes, which authentication method does the proxy service use (none, basic authentication, or certificate)?
1. How important is an Azure native security offering for the Arc enabled Kubernetes solution?
1. Which hybrid-cloud container security solution are you currently using for threat prevention, detection, and response?
1. Did you have audit log enabled on your Arc enabled Kubernetes cluster before this preview?
1. Were the steps and instruction of this preview clear and easy to understand? Did you run into any issues or errors during the preview?
1. Did you get additional alerts during the preview time? Were they helpful/accurate? Would you like to see any adjustments to these alerts?
1. What would you like to see in future release of "Azure Defender for Arc enabled Kubernetes"?
1. Any other feedback you would like to give?

## Key contacts

Feature PM: Maya Herskovic [mahersko@microsoft.com](mailto:mahersko@microsoft.com)

Private Preview PM: Gili Ben Zvi | [gibenzvi@microsoft.com](mailto:gibenzvi@microsoft.com)

Thank you! Your participation is a vital part of our Cloud + AI Security product development process.

Microsoft respects your privacy. Review our online [Privacy statement](https://privacy.microsoft.com/privacystatement). Microsoft Corporation, One Microsoft Way, Redmond, WA, USA 98052.

At any point you may opt-out of the program by filling out [this form](https://aka.ms/OptOut_PrivatePreviewProgram).
