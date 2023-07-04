---
title: Set up kubectl access 
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to obtain kubectl files that can be used to monitor your deployment and obtain diagnostics.
author: TODO
ms.author: TODO
ms.service: private-5g-core
ms.topic: how-to
ms.date: TODO
ms.custom: template-how-to 
zone_pivot_groups: ase-pro-version
---

# Set up kubectl access

This how-to guide explains how to obtain the necessary *kubeconfig* files if you wish to use *kubectl* to monitor your deployment, or obtain certain diagnostics.

## Read-only access

For running read-only *kubectl* commands such as to describe pods and view logs, you can download a *kubeconfig* file from the ASE local UI. Under **Device**, select **Download config**.

:::image type="content" source="media/set-up-kubectl/commission-cluster-kubernetes-download-config.png" alt-text="Screenshot of Kubernetes dashboard showing link to download config.":::

The downloaded file is called *config.json*. This file has permission to describe pods and view logs, but not to access pods with *kubectl exec*.

## Diagnostics access

The Azure Private 5G Core deployment uses the *core* namespace. If you need to collect diagnostics, you can download a *kubeconfig* file with full access to the *core* namespace. To do this set up a minishell session and run the necessary commands as directed below.

You only need to perform this procedure once. If you have previously done this, you can use the previously-saved *kubeconfig* file.

### Enter a minishell session

You need to run minishell commands on Azure Stack Edge during this procedure. You must use a Windows machine that is on a network with access to the management port of the ASE. You should be able to view the ASE local UI to verify you have access.

> [!TIP]
> To access the local UI, see [Tutorial: Connect to Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-connect.md).

#### Enable WinRM on your machine

The following process uses PowerShell and needs WinRM to be enabled on your machine. Run the following command from a PowerShell window in Administrator mode:
```powershell
winrm quickconfig
```
WinRM may already be enabled on your machine, as you only need to do it once. Ensure your network connections are set to Private or Domain (not Public), and accept any changes.

#### Start the minishell session

1. From a PowerShell window, enter the ASE management IP address (including quotation marks, for example `"10.10.5.90"`):
    ```powershell
   $ip = "<ASE_IP_address>"
   
   $sessopt = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck

   $minishellSession = New-PSSession -ComputerName $ip -ConfigurationName "Minishell" -Credential ~\EdgeUser -UseSSL -SessionOption $sessopt
    ```

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

> [!TIP]
> If there is a network change, the session can break. Run `Get-PSSession` to view the state of the session.  If it is still connected, you should still be able to run minishell commands. If it is broken or disconnected, run `Remove-PSSession` to remove the session locally, then start a new session.

### Set up kubectl access

- If this is the first time you are running this procedure, you need to run the following steps to create the namespace, download the *kubeconfig* file and use it to grant access to the namespace.
    ```powershell
    Invoke-Command -Session $minishellSession -ScriptBlock {New-HcsKubernetesNamespace -Namespace "core"}
    Invoke-Command -Session $minishellSession -ScriptBlock {New-HcsKubernetesUser -UserName "core"} | Out-File -FilePath .\kubeconfig-core.yaml
    Invoke-Command -Session $minishellSession -ScriptBlock {Grant-HcsKubernetesNamespaceAccess -Namespace "core" -UserName "core"}
    ```
    If you have run these steps previously, you will get an error like `The Kubernetes namespace 'core' already exists`. If this happens skip straight to the next bullet to retrieve the previously-generated file.

- If you have run this procedure before, you can retrieve the previously-generated *kubeconfig* file immediately by running:
    ```powershell
    Invoke-Command -Session $miniShellSession -ScriptBlock { Get-HcsKubernetesUserConfig -UserName "core" }
    ```

For more information, see [Configure cluster access via Kubernetes RBAC](../databox-online/azure-stack-edge-gpu-create-kubernetes-cluster.md#configure-cluster-access-via-kubernetes-rbac).
