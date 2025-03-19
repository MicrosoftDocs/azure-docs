---
title: Host pool management approaches - Azure Virtual Desktop
description: Learn about the different host pool management approaches of session host configuration management and standard management in Azure Virtual Desktop.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 11/19/2024
---

# Host pool management approaches for Azure Virtual Desktop

> [!IMPORTANT]
> Host pools with a session host configuration for Azure Virtual Desktop are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Host pools are logical groupings of session host virtual machines that have the same configuration and serve the same workload. You can choose one of two host pool management approaches, *standard* and using a *session host configuration* (preview). In this article, you learn about each management approach and the differences between them to help you decide which one to use.

> [!CAUTION]
> Currently the host pool management approach is set when you create a host pool and can't be changed later. The management approach is stored in the host pool's properties. Later in the preview for using a session host configuration, we plan to enable any host pool to use a session host configuration.

## Session host configuration management approach

Creating, updating, and scaling session hosts in a host pool can require much effort if you don't have existing tools and processes in place. The session host configuration management approach uses a combination of the following native features to provide an integrated and dynamic experience:

- A *[session host configuration](#session-host-configuration)* specifies **what** the configuration of session hosts should be.

- A *[session host management policy](#session-host-management-policy)* specifies **how** session hosts should be created and updated.

- *[Session host update](session-host-update.md)* updates session hosts **when** there's an update made to the session host configuration. Session host update ensures that all session hosts in the pool have the same configuration.

- *[Autoscale](autoscale-scenarios.md)* dynamically scales the number of session hosts up and down based on the actual usage and the schedules defined in the scaling plan.

> [!IMPORTANT]
> - The session host configuration management approach can be used with pooled host pools only. When using a host pool with a session host configuration, you can't create, update or scale session hosts outside of the Azure Virtual Desktop service using tools designed for host pools with standard management.
>
> - You can only join session hosts to an Active Directory domain. Joining session hosts to Microsoft Entra ID isn't supported, but you can use [Microsoft Entra hybrid join](/entra/identity/devices/concept-hybrid-join).

### Session host configuration

A session host configuration is a sub-resource of the session host configuration management approach that specifies the configuration of session hosts in the host pool. The session host configuration persists throughout the lifecycle of the host pool and is aligned with the session hosts in the host pool. The session host configuration includes the following properties: 

:::row:::
    :::column:::
        - VM image
        - VM name prefix
	    - VM resource group
        - VM size
        - OS disk information
        - Domain join information
        - VM network configuration
        - VM location
    :::column-end:::
    :::column:::
        - VM availability zones
        - VM security type
        - VM admin credentials
        - VM name prefix
        - VM boot diagnostics information
        - Custom configuration PowerShell script
        - VM Tags
    :::column-end:::
:::row-end:::

Any newly created session hosts are created from the session host configuration for the host pool. To update the session hosts in your host pool, first you must update the session host configuration. After updating the session host configuration, you schedule when you would like that update to be applied to the session hosts in the host pool using the session host update feature. If there are no session hosts in the host pool, any property of the session host configuration can be changed without needing to schedule a session host update.

For a comparison of host pool with a session host configuration and a host pool with standard management, see [Compare host pool management approaches](#compare-host-pool-management-approaches).

### Session host management policy

A session host management policy is a sub-resource of a host pool that specifies how session hosts in the host pool should be updated. The session host management policy persists throughout the lifetime of the host pool and used by session host update when updating the session hosts in the host pool. Each host pool with a session host configuration only has a single session host management policy, and you can't delete a session host management policy independently of the host pool.

When you use the Azure portal, a default session host management policy is created when you create a host pool with a session host configuration. You can override its values when updating session hosts, or you can also update the session host management policy at any time using PowerShell.

The session host management policy includes the following parameters: 

| Parameter  | Description | Azure portal default value |
|--|--|--|
| **Time zone** | The time zone to use when scheduling an update of the session hosts in a host pool. | UTC |
| **Save original VM** | Determines whether to save the original virtual machine (VM) before the update. This parameter is useful in rollback scenarios, but normal costs apply for storing the original VM's components. | The original VM is saved. |
| **Max VMs removed during update** | The maximum number of session hosts to update concurrently, also known as the *batch size*. | 1 |
| **Logoff delay in minutes** | The amount of time to wait after an update start time for users to be notified to sign out, between 0 and 60 minutes. Users will automatically be signed out after this time elapses. | 2 |
| **Logoff message** | A message to display to users that the session host they're connected to will be updated. | `You will be signed out` |

## Standard management approach

With the standard host pool management approach, you manage creating, updating, and scaling session hosts in a host pool. If you want to use existing tools and processes, such as automated pipelines, custom scripts, you need to use the standard host pool management type. Existing tooling designed for standard management won't work with a session host configuration. For a comparison of host pool with a session host configuration and a host pool with standard management, see [Compare host pool management approaches](#compare-host-pool-management-approaches).

## Compare host pool management approaches

The following table compares the management approach of host pools with a session host configuration and host pools with standard management in different scenarios or when using different features of Azure Virtual Desktop:

| Scenario or feature | Session host configuration | Standard management |
|---|---|---|
| Create session hosts | [Add session hosts](add-session-hosts-host-pool.md?pivots=host-pool-session-host-configuration) using the Azure portal based on the session host configuration. You can't retrieve a registration token to add session hosts created outside of Azure Virtual Desktop to a host pool. | [Add session hosts](add-session-hosts-host-pool.md?pivots=host-pool-standard) using your preferred method, then use a registration token to add them to a host pool. If you use the Azure portal, you need to input the configuration each time. |
| Configure session hosts | The session host configuration ensures the configuration of session hosts is consistent. | You have to ensure the configuration of session hosts in the host pool is consistent. Session host configuration isn't available. |
| Scale session hosts | Use [autoscale](autoscale-scenarios.md) to turn session hosts on and off or create and delete session hosts based on a schedule and usage. | Use [autoscale](autoscale-scenarios.md) to turn session hosts on and off based on a schedule and usage. |
| Update session host image | Use [session host update](session-host-update.md) to update the image and configuration of your session hosts based on the session host management policy and session host configuration. | Use your own existing tools and processes, such as automated pipelines and custom scripts to update the image and configuration of your session hosts. You can't use session host update. |
| Automatically power on session hosts | Use [Start VM on Connect](start-virtual-machine-connect.md) to enable end users to turn on their session hosts only when they need them. | Use [Start VM on Connect](start-virtual-machine-connect.md) to enable end users to turn on their session hosts only when they need them. |

## Next steps

- Learn how to [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md?pivots=host-pool-session-host-configuration) with a session host configuration or standard management.

- Learn about [Session host update](session-host-update.md).
