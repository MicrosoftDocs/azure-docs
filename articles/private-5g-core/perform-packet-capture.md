---
title: Perform packet capture for a packet core instance
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to perform data plane packet capture for a packet core instance. 
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 12/13/2022
ms.custom: template-how-to
---

# Perform packet capture for a packet core instance

Packet capture for data plane packets is performed using the UPF Trace (UPFT) tool. You can use this tool to monitor and record packets on any N3 or N6 interface on your device, similar to the standard tcpdump tool. Data plane packet capture works by mirroring packets to a Linux kernel interface, which can then be monitored using the standard tcpdump tool. In this how-to guide, you'll learn how to perform data plane packet capture for a packet core instance.

> [!IMPORTANT]
> Performing packet capture will reduce the performance of your system and the throughput of your data plane. It is therefore only recommended to use this tool at low scale during initial testing.

## Prerequisites

- Identify the Kubernetes - Azure Arc resource representing the Azure Arc-enabled Kubernetes cluster on which your packet core instance is running.
- Ensure you have [Contributor](../role-based-access-control/built-in-roles.md#contributor) role assignment on the Azure subscription containing the Kubernetes - Azure Arc resource.
- Ensure your local machine has admin kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires an admin kubeconfig file. Contact your trials engineer for instructions on how to obtain this.

## Performing packet capture

1. Enter the UPF-PP troubleshooter pod, run `kubectl exec -it -n core core-upf-pp-0 -c troubleshooter – bash`.

1. To see the list of interfaces that can be monitored, run `upft.py list`.

1. Either:
    - Run `upftdump.py` with any parameters that you would usually pass to tcpdump. In particular, `-i` to specify the interface, and `-w` to specify where to write to. Close the UPFT tool when done by pressing <kbd>Ctrl + C</kbd>.
    - Or if you wish to enable packet capture and then run tcpdump separately, do the following:
        1. Enable packet capture by running `upft.py start <interface> <duration>`, where
            - \<interface\> specifies the interface or interfaces to enable capture on. You can specify `any` to enable packet capture on all possible interfaces.
            - \<duration\> specifies the time in seconds before packet capture automatically disables.
        1. Run `tcpdump` on the interface.
        1. Once complete, run `upft.py stop <interface>` to disable packet capture if the timer has not expired.
1. Exit to leave the container.
1. Copy any output files, run `kubectl cp -n core core-upf-pp-0: <path to output file> <location to copy to> -c troubleshooter`.

## Next steps

- [Learn more about enabling log analytics Azure Private 5G Core](enable-log-analytics-for-private-5g-core.md)
- [Learn more about monitoring Azure Private 5G Core using Log Analytics](monitor-private-5g-core-with-log-analytics.md)
