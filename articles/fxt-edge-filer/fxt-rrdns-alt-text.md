---
title: Azure FXT Edge Filer DNS configuration alt text
description: Text description of image fxt-rrdns-diagram.png
author: ekpgh
ms.service: fxt-edge-filer
ms.topic: reference
ms.date: 04/30/2019
ms.author: v-erkell
---

# text description for FXT Edge Filer DNS diagram (fxt-rrdns-diagram.png)

The diagram shows connections among three categories of elements: a single vserver (at the left), three IP addresses (middle column), and three client interfaces (right column). 

A circle at the left labeled "vserver1" is connected by arrows pointing toward three circles labeled with IP addresses: 10.0.0.10, 10.0.0.11, and 10.0.0.12. The arrows from the "vserver1" circle to the three IP circles have the caption "A". 

Each of the IP address circles is connected by two arrows to a circle labeled as a client - the circle with IP 10.0.0.10 is connected to "vs1-client-IP-10", the circle with IP 10.0.0.11 is connected to "vs1-client-IP-11", and the circle with IP 10.0.0.12 is connected to "vs1-client-IP-11". 

The connections between the IP address circles and the client circles are two arrows: one arrow labeled "PTR" that points from the IP address circle to the client interface circle, and one arrow labeled "A" that points from the client interface circle to the IP address circle.

[link back to DNS "Configuration details" section](fxt-configure-network.md#round-robin-dns-configuration-details)