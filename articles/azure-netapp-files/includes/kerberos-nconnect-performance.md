---
title: include file
description: include file
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 08/19/2022
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files/performance-linux-mount-options.md
# faq-performance.md
---

It is not recommended to use `nconnect` and `sec=krb5*` mount options together. Performance degradation has been observed when using the two options in combination.

The Generic Security Standard Application Programming Interface (GSS-API) provides a way for applications to protect data sent to peer applications. This data might be sent from a client on one machine to a server on another machine.  

When `nconnect` is used in Linux, the GSS security context is shared between all the `nconnect` connections to a particular server. TCP is a reliable transport that supports out-of-order packet delivery to deal with out-of-order packets in a GSS stream, using a sliding window of sequence numbers. When packets not in the sequence window are received, the security context is discarded, and a new security context is negotiated. All messages sent with in the now-discarded context are no longer valid, thus requiring the messages to be sent again. Larger number of packets in an `nconnect` setup cause frequent out-of-window packets, triggering the described behavior. No specific degradation percentages can be stated with this behavior. 
 