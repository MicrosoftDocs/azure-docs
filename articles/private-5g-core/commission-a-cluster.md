---
title: Commission a cluster 
titleSuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to commission an Azure Stack Edge (or possible AKS) cluster in your private mobile network. 
author: lauraallan
ms.author: lauraallan
ms.service: private-5g-core
ms.topic: how-to
ms.date: 12/15/2022
ms.custom: template-how-to 
---

# Commission a cluster

<!-- Not entirely sure what the cluster is - is it an Azure Stack Edge cluster or an Azure Kubernetes cluster? Or something else entirely? Update title/metadata once clear. -->
<!-- Images will probably all need replacing as don't adhere to the guidelines. Some are probably not required, anyway (they're hardly "sparingly" used in this doc!) -->
<!-- Text not really written in the appropriate format. I've cleaned up some stuff but my lack of understanding has hampered this, as I often didn't know what the Word doc was trying to say. -->
<!-- Some of the procedures don't really start at the beginning (with "Sign in to wherever you need to do this") -->
<!-- There are a few specific comments throughout the text -->

## Enter a minishell session

You need to run minishell commands on Azure Stack Edge during this procedure. You must use a Windows machine that is on a network with access to the management port of the Azure Stack Edge – you should be able to view the Azure Stack Edge local UI to verify you have access.

### Enable WinRM on your machine

The following process uses PowerShell and needs WinRM to be enabled on your machine. Run the following command from a PowerShell window in Administrator mode:

`winrm quickconfig`

WinRM may already be enabled on your machine, as you only need to do it once. Ensure your network connections are set to Private or Domain (not Public), and accept any changes.

### Start the minishell session

1. From a PowerShell window, enter:

   `$ip = "<IP address of Azure Stack Edge>"`

   > [!NOTE]
   > This is the IP address in quotes: `$ip = "10.10.5.90"`

   `$sessopt = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck`

   `$minishellSession = New-PSSession -ComputerName $ip -ConfigurationName "Minishell" -Credential ~\EdgeUser -UseSSL -SessionOption $sessopt`
1. At the prompt, enter your Azure Stack Edge password. Ignore the following message:

   ```powershell
   WARNING: The Windows PowerShell interface of your device is intended to
   be used only for the initial network configuration. Please
   engage Microsoft Support if you need to access this interface
   to troubleshoot any potential issues you may be experiencing.
   Changes made through this interface without involving Microsoft
   Support could result in an unsupported configuration.
   ```

You now have a minishell session set up ready to enable your Azure Kubernetes Service in the next step.

## Enable Azure Kubernetes Service on the Azure Stack Edge box

Run the following commands at the Powershell prompt. The first command uses the Object ID you obtained in the prerequisites – don't use quotes around this Object ID.

`Invoke-Command -Session $minishellSession -ScriptBlock {Set-HcsKubeClusterArcInfo -CustomLocationsObjectId <oid_from_prereqs>}`

`Invoke-Command -Session $minishellSession -ScriptBlock {Enable-HcsAzureKubernetesService -f}`

Once you've run these commands, you should see an updated option in the local UI – **Kubernetes** becomes **Kubernetes (Preview)** as shown in the following image.

<!-- "local UI"? probably should be more specific - is this the ASE UI? -->

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-kubernetes-preview.png" alt-text="Screenshot of configuration menu, with Kubernetes (Preview) highlighted":::

You'll set up the configuration in [Add Compute and IP addresses](#add-compute-and-ip-addresses).
Additionally, if you go to the Azure portal and find your Azure Stack Edge resource you should see an Azure Kubernetes Service option (shown in the following image). You'll set up the Azure Kubernetes Service in [Start the cluster and set up Arc](#start-the-cluster-and-set-up-arc).

<!-- I've added these links, so need to check they're correct. Word doc just said "we will get to that shortly" -->

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-ASE-resource.png" alt-text="Screenshot of Azure Stack Edge resource in the Azure portal. Azure Kubernetes Service (PREVIEW) is shown under Edge services in the left menu.":::

## Enable high performance networking

Azure Private 5G Core private mobile networks require high performance networking (HPN) to be enabled. Azure Stack Edge <!-- This may not be quite right; the Word doc says ASE2210. Phrasing of next bit might not be quite right, either. --> will set up most configuration automatically, after you enable it using a minishell command. You can continue to use the minishell session you started in [Enter a minishell session](#enter-a-minishell-session). Run the following command:

`Invoke-Command -Session $minishellSession -ScriptBlock {Set-HcsNumaLpMapping -UseSkuPolicy}`

Wait for the machine to reboot if necessary (approximately 5 minutes).

## Set up advanced networking

You now need to configure virtual switches and virtual networks on those switches. You'll use the **Advanced networking** section of the Azure Stack Edge local UI to do this task.

You can input all the settings on this page before selecting **Apply** at the bottom to apply them all at once.

<!-- This next procedure probably needs a lot of restructuring/rewording. Also not sure about the capitalization of various words (like Control Plane Access Interface). -->

First, you need to configure three virtual switches. The names of the virtual switches aren't crucial, but there must be a virtual switch associated with each port before the next step. The virtual switches may already be present if you have other Virtual Network Functions (VNFs) set up.

- Select **Add virtual switch** and fill in the side panel appropriately for each switch before selecting **Modify** to save that configuration.
  - Create a virtual switch on the port that should have compute enabled (the management port). Use the format *vswitch-portX*, where *X* is the number of the port. For example, create *vswitch-port3* on port 3.  
  - Create a virtual switch on port 5 with the name *vswitch-port5*.
  - Create a virtual switch on port 6 with the name *vswitch-port6*.

You should now see something similar to the following image:
:::image type="content" source="media/commission-a-cluster/commission-a-cluster-virtual-switch.png" alt-text="Screenshot showing three virtual switches, where the names correspond to the network interface the switch is on. ":::

Next, you need to configure virtual networks for your ports.

- You need to create virtual networks representing the following interfaces:
  - Control Plane Access Interface
  - User Plane Access Interface
  - User Plane Date Interface(s)
- You can name these networks yourself, but the name **must** match what you configure in the Azure portal when deploying Azure Private 5G Core.
  - For example, if you’re deploying a 5G core, you can use the names N2, N3 and N6-DN1, N6-DN2, N6-DN3 (for a multi Data Network (DN) deployment) or simply N6 for a single DN deployment. The following example uses the multi-DN set-up.

Carry out the following procedure three times plus the number of supplementary DNs (so five times in total, if you have 3 DNs on the N6 side): <!-- this can definitely be worded better, but I don't understand it well enough to do so! -->

- Select **Add virtual network** and fill in the side panel. <!-- maybe pane? or pop-up menu? not sure what side panel is here. -->
  - **Virtual switch**: select *vswitch-port5* for N2 and N3, and select *vswitch-port6* for N6-DN1, N6-DN2, and N6-DN3.
  - **Name**: *N2*, *N3*, *N6-DN1*, *N6-DN2*, or *N6-DN3*.
  - **VLAN**: 0
  - **Subnet mask** and **Gateway** must match the external values for the port.
    - For example, *255.255.255.0* and *10.232.44.1*
    - If there's no gateway between the Access Interface and gNB/RAN, use the gNB/RAN IP address as the gateway address. If there's more than one gNB connected via a switch, choose one of the IP addresses for the gateway.
  - Select **Modify** to save the configuration for this virtual network.
- Select **Apply** at the bottom of the page and wait for the notification (a bell icon) to confirm that the settings have been applied. Applying the settings will take approximately 15 minutes.

The page should now look like the following image:

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-advanced-networking.png" alt-text="Screenshot showing Advanced networking, with a table of virtual switch information and a table of virtual network information.":::

## Add compute and IP addresses

In the local Azure Stack Edge UI, go to the Kubernetes (Preview) page. You'll set up all of the configuration and then apply it once, as you did in [Set up Advanced Networking](#set-up-advanced-networking).

- Under **Compute virtual switch**, select **Modify**.
  - Select the management vswitch (for example, *vswitch-port3*)
  - Enter six IP addresses in a range for the node IP addresses on the management network.
  - Enter one IP address in a range for the service IP address, also on the management network.
  - Select **Modify** at the bottom of the panel to save the configuration.
- Under **Virtual network**, select a vnet (from **N2**, **N3**, **N6-DN1**, **N6-DN2**, and **N6-DN3**). In the side panel:
  - Enable the vnet for Kubernetes and add a pool of IP addresses.
    - Add a range of one IP address for the appropriate address (N2, N3, N6-DN1, N6-DN2 or N6-DN3 as collected earlier.
    - For example, *10.10.10.20-10.10.10.20*.
  - Repeat for each of the N2, N3, N6-DN1, N6-DN2, and N6-DN3 vnets.
  - Select **Modify** at the bottom of the panel to save the configuration.
- Select **Apply** at the bottom of the page and wait for the settings to be applied. Applying the settings will take approximately 15 minutes.

The page should now look like the following image:

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-kubernetes-preview-enabled.png" alt-text="Screenshot showing Kubernetes (Preview) with two tables. The first table is called Compute virtual switch and the second is called Virtual network. A green tick shows that the virtual networks are enabled for Kubernetes.":::

## Start the cluster and set up Arc

Access the Azure portal and go to the Azure Stack Edge resource created in the Azure portal.

If you're already running additional VMs on your Azure Stack Edge, it’s best to stop them now, and start them again once the cluster is deployed. The cluster requires access to specific CPU resources that running VMs may already be using.

1. To deploy the cluster, select the Kubernetes option and then select the **Add** button to configure the cluster.

   :::image type="content" source="media/commission-a-cluster/commission-a-cluster-add-kubernetes.png" alt-text="Screenshot of Kubernetes Overview pane, showing the Add button to configure Kubernetes service.":::

1. For the **Node size**, select **Standard_F16s_HPN**.
1. Ensure the **Arc enabled Kubernetes** checkbox is selected.
1. The Arc enabled Kubernetes service is automatically created in the same resource group as your Azure Stack Edge resource. If your Azure Stack Edge resource group is not in the East US region, you must change the region using the **Change** link. Currently, the Arc resource and its resource group, MUST be created in the East US region as that is the only region that Azure Private 5G Core supports. <!-- Not sure if this step is needed, if you have to create in EastUS. I may have misunderstood the Word doc. -->

> [!NOTE]
> You need Owner permission on the resource group.

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-create-kubernetes-service.png" alt-text="Screenshot of Create Kubernetes service, showing the basic cluster configuration described in steps 1 to 4.":::

Work through the prompts to set up the service.

The creation of the Kubernetes cluster takes about 20 minutes. During creation, there may be a critical alarm displayed on the Azure Stack Edge resource. This alarm is expected and should disappear after a few minutes.

Once deployed, the portal should show that the Kubernetes service is healthy, as in the following image:

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-kubernetes-overview-healthy.png" alt-text="Screenshot of Azure Kubernetes Service (Preview) Overview pane with message that Kubernetes service is healthy.":::

## Kubectl cluster access

For read-only *kubectl* access to the cluster, you can download a *kubeconfig* file from the local UI. Under **Device**, select **Download config**.

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-kubernetes-download-config.png" alt-text="Screenshot of Kubernetes dashboard showing link to download config.":::

The downloaded file is called *config.json*. By default, *kubectl* expects its configuration file to just be called *config*. <!-- And so you should change the name? -->

This file has permission to describe pods and view logs, but not exec into pods. <!-- Not sure what to replace "exec" with? -->

The Azure Private 5G Core deployment uses the *core* namespace. If you need to collect diagnostics, you can download a *kubeconfig* file with full access to the *core* namespace by following the instructions to [Configure cluster access via Kubernetes RBAC](/azure/databox-online/azure-stack-edge-gpu-create-kubernetes-cluster#configure-cluster-access-via-kubernetes-rbac). This maps <!-- is equivalent to? Whole sentence/procedure needs sorting out! --> to issuing the following commands with the minishell session available:

`Invoke-Command -Session $minishellSession -ScriptBlock {New-HcsKubernetesNamespace -Namespace "core"}`

`Invoke-Command -Session $minishellSession -ScriptBlock {New-HcsKubernetesUser -UserName "core"}`

Save the returned *kubeconfig* file.

`Invoke-Command -Session $minishellSession -ScriptBlock {Grant-HcsKubernetesNamespaceAccess -Namespace "core" -UserName "core"}`

If you need to retrieve the *kubeconfig* later on, the following command can be used:

`Invoke-Command -Session $miniShellSession -ScriptBlock { Get-HcsKubernetesUserConfig -UserName "core" }`

For full administrator access to the cluster, you need to use a support session to obtain the administrator *kubeconfig*. This should only be required if there's a suspected issue with the platform itself. Ask your support representative if you need the administrator *kubeconfig*.

## Portal cluster access

Open your Azure Stack Edge resource in the Azure portal. Go to the Azure Kubernetes Service pane (shown in [Start the cluster and set up Arc](#start-the-cluster-and-set-up-arc)) and select the **Manage** link to open the **Arc** pane.

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-manage-kubernetes.png" alt-text="Screenshot of part of the Azure Kubernetes Service (PREVIEW) Overview pane, showing the Manage link for Arc enabled Kubernetes.":::

Explore the cluster using the options in the **Kubernetes resources (preview)** menu:

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-kubernetes-resources.png" alt-text="Screenshot of Kubernetes resources (preview) menu, showing namespaces, workloads, services and ingresses, storage and configuration options.":::

You'll initially be presented with a sign-in request box. The token to use for signing in is obtained from the *kubeconfig* file retrieved from the local UI in [Kubectl cluster access](#kubectl-cluster-access). There's a string prefixed by *token:*, near the end of the *kubeconfig* file. Copy this string into the box in the portal (ensuring you don't have line break characters copied), and select **Sign in**.

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-kubernetes-sign-in.png" alt-text="Screenshot of sign-in screen for Kubernetes resource. There's a box to enter your service account bearer token and a sign-in button.":::

You can now view information about what’s running on the cluster – the following is an example from the **Workloads** pane:

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-kubernetes-workload-pane.png" alt-text="Screenshot of Workloads pane in Kubernetes resources (preview). The pods tab is active and shows details about what's running.":::

## Verify the cluster configuration (optional)

You can verify that the Azure Stack Edge cluster is set up correctly by running the following *kubectl* commands using the *kubeconfig* downloaded from the UI in [Kubectl cluster access](#kubectl-cluster-access):

`kubectl get nodes`

This command will return two nodes, one named *nodepool-aaa-bbb* and one named *target-cluster-control-plane-ccc*.

To view all the running pods, run:

`kubectl get pods -A`

Additionally, your Azure Stack Edge Arc cluster should now be visible in the Azure portal. <!-- probably need to say where/how to view? -->

## Cluster extensions

Azure Private 5G Core private mobile networks require a custom location and specific Kubernetes extensions. Your support representative will supply a bash script to install  extensions.  

The script comes with a parameters file (*A40AseParms.json*) which needs to be filled in. You can't leave comments in the parameters file and should delete them once you've filled in your values. The following example shows a version with comments describing what values you need to fill in:

```json
`{
    "ARC": {                                     # The following have been used above
        "SubscriptionId": "CUSTOMIZE_ME",        # Your Azure subscription ID
        "ResourceGroupName": "CUSTOMIZE_ME",     # The Resource group used for the ASE ARC cluster
        "ResourceName": "CUSTOMIZE_ME",          # The name of the ASE ARC cluster in Azure

        "CustomLocation": "CUSTOMIZE_ME",        # The name for the custom location that will                       
                                                 # be created in Azure by the script.
                                                 # For example, “my-ase-custom-loc”

        "Location": "eastus"                     # This is fixed for this release
    }
}
`
```

You can obtain the name of the Azure Stack Edge Arc cluster (the *\<Resource Name\>*) by using the **Manage** link in the **Azure Kubernetes Service** pane in the Azure portal.

In order to use a consistent environment, we recommend running the script in Azure Cloud Shell. You can access the Azure Cloud Shell using either the button or the ellipses in the banner of the Azure portal.

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-azure-cloud-shell-button.png" alt-text="Screenshot of Azure portal showing the Cloud Shell button and the ellipses in the banner.":::

Select the *Bash* option (not *PowerShell*) and wait for the terminal to start up. You can then upload the script and complete parameters file by selecting the upload button:

:::image type="content" source="media/commission-a-cluster/commission-a-cluster-upload-button.png" alt-text="Screenshot of upload button in Azure Cloud Shell terminal.":::

Once you've uploaded the script and parameters file, you can run the install script:

- Ensure the script is executable:

   `chmod 777 setup_nfo_cust_loc.sh`

- Ensure you're using the correct subscription:

   `az account set --subscription <subscription_id>`

- Execute the script:

   `./setup_nfo_cust_loc.sh connect`

The script makes calls into several different Azure services. It therefore takes a variable amount of time to run, but will typically take up to 30 minutes on a new subscription.

If you're installing multiple machines or reinstalling a previously installed machine, you should either use a new directory or ensure the log files in the *install* directory are removed. The script uses the log files to track progress and therefore may not run all the steps on the second and subsequent machines.

There may be occasional failures of the script due to temporary problems in the extension installation process. If an error is reported, it’s worth waiting 10 minutes and then running the script again. The script keeps tracks of its progress via files in a directory it creates called *install* so will skip previously successful steps.

Once the script is successful, you should see the new Custom Location visible as a resource in the Azure portal within the specified Resource Group. Using the `kubectl get pods -A` command (with access to your *kubeconfig*) should also show new pods corresponding to the extensions that have been installed. Specifically, there will be one pod in the *azurehybridnetwork* namespace, and one in the *packet-core-monitor* namespace.

## Next steps

You can now collect the information you'll need to deploy your private network.

- [Collect the required information to deploy a private mobile network](/azure/private-5g-core/collect-required-information-for-private-mobile-network)
