---
title: Set up kubectl access 
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to obtain kubectl files that can be used to monitor your deployment and obtain diagnostics.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 07/07/2023
ms.custom: template-how-to 
---

# Set up kubectl access

This how-to guide explains how to obtain the necessary *kubeconfig* files as needed for other procedures. The read-only file is sufficient to view cluster configuration. The core namespace file is needed for operations such as modifying local or Azure Active Directory authentication, or for gathering packet capture.

## Read-only access

For running read-only *kubectl* commands such as to describe pods and view logs, you can download a *kubeconfig* file from the ASE local UI. Under **Device**, select **Download config**.

> [!TIP]
> To access the local UI, see [Tutorial: Connect to Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-connect.md).

:::image type="content" source="media/set-up-kubectl/commission-cluster-kubernetes-download-config.png" alt-text="Screenshot of Kubernetes dashboard showing link to download config.":::

The downloaded file is called *config.json*. This file has permission to describe pods and view logs, but not to access pods with *kubectl exec*.

## Core namespace access

The Azure Private 5G Core deployment uses the *core* namespace. For operations such as modifying local or Azure Active Directory authentication, or for gathering packet capture, you need a *kubeconfig* file with full access to the *core* namespace. To download this file set up a minishell session and run the necessary commands as directed in this section.

You only need to perform this procedure once. If you've done this procedure before you can use the previously saved *kubeconfig* file.

### Enter a minishell session

You need to run minishell commands on Azure Stack Edge during this procedure. You must use a Windows machine that is on a network with access to the management port of the ASE. You should be able to view the ASE local UI to verify you have access.

#### Enable WinRM on your machine

The following process uses PowerShell and needs WinRM to be enabled on your machine. Run the following command from a PowerShell window in Administrator mode:
```powershell
winrm quickconfig
```
WinRM may already be enabled on your machine, as you only need to do it once. Ensure your network connections are set to Private or Domain (not Public), and accept any changes.

> [!TIP]
> WinRM opens your PC to remote connections, which is required for the rest of the procedure.  If you don't want to leave remote connections allowed, run  `Stop-Service WinRM -PassThru` and then `Set-Service WinRM -StartupType Disabled -PassThru` from a PowerShell window in Administrator mode after you have completed the rest of the procedure to obtain core namespace access.

#### Start the minishell session

1. From a PowerShell window in Administrator mode, enter the ASE management IP address (including quotation marks, for example `"10.10.5.90"`):
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

You now have a minishell session set up ready to obtain the *kubeconfig* file in the next step.

> [!TIP]
> If there is a network change, the session can break. Run `Get-PSSession` to view the state of the session.  If it is still connected, you should still be able to run minishell commands. If it is broken or disconnected, run `Remove-PSSession` to remove the session locally, then start a new session.

### Set up kubectl access

- If this is the first time you're running this procedure, you need to run the following steps. These steps create the namespace, download the *kubeconfig* file and use it to grant access to the namespace.
    ```powershell
    Invoke-Command -Session $minishellSession -ScriptBlock {New-HcsKubernetesNamespace -Namespace "core"}
    Invoke-Command -Session $minishellSession -ScriptBlock {New-HcsKubernetesUser -UserName "core"} | Out-File -FilePath .\kubeconfig-core.yaml
    Invoke-Command -Session $minishellSession -ScriptBlock {Grant-HcsKubernetesNamespaceAccess -Namespace "core" -UserName "core"}
    ```
    If you see an error like `The Kubernetes namespace 'core' already exists`, it means you have run these steps before. In this case skip straight to the next bullet to retrieve the previously generated file.

- If you have run this procedure before, you can retrieve the previously generated *kubeconfig* file immediately by running:
    ```powershell
    Invoke-Command -Session $miniShellSession -ScriptBlock { Get-HcsKubernetesUserConfig -UserName "core" }
    ```

For more information, see [Configure cluster access via Kubernetes RBAC](../databox-online/azure-stack-edge-gpu-create-kubernetes-cluster.md#configure-cluster-access-via-kubernetes-rbac).

## Next steps
- Save the *kubeconfig* file so it's available to use if you need it in the future.
- If you need the *kubeconfig* file as part of completing a different procedure (such as to set up Azure Active Directory authentication), return to that procedure and continue.