---
title: WebRTC Protocols
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

# WebRTC Protocols

As you develop on Spool, you'll encounter terms like ICE, STUN, NAT, TURN, and SDP. These are each protocols that help your client devices connect with one another.

## ICE

Your users' devices usually sit behind firewalls, routers, and other network "gateways". For one device to connect to another over WebRTC, each device needs to know exactly who it's talking to. The ICE (Interactive Connectivity Establishment) protocol helps establish this device identity.

 - when do I need to care
 - how does spool relate


## NAT

Because you might have many devices sitting behind a single router, we need a way to uniquely identify those devices. While the ICE protocol helps us connect two devices with unique identities, NAT (Network Address Translation) is the process that gives your device a unique identity. It does this by translating your device's private IP address into your router's public IP address plus a unique port. 

A STUN server is used to discover a device's public IP address. Though in some cases, routers restrict the discoverability of devices via NAT. This is where TURN comes into play.

 - when do I need to care
 - how does spool relate


## STUN

STUN is an acronym within an acronym. It stands for "Session Traversal Utilities for NAT". STUN allows one device to discover another device's public IP address if it's available. If it's not available, a TURN server must be used.

 - when do I need to care
 - how does spool relate


## TURN

If your device is sitting behind a router that uses something called "Symmetric NAT", it'll only accept connections from devices that you've already connected to. A TURN (Traversal Using Relays Around NAT) server acts as a middleman between devices through which all information flows to get around the challenge that Symmetric NATs pose.

 - when do I need to care
 - how does spool relate

## SDP

SDP (Session Description Protocol) is uses to describe the format of the media being shared between clients. Your device will capture and transmit media using a particular format (resolution, codec, etc). SDP is what helps devices understand each other's media by facilitating metadata exchange. To learn more about SDP, feel free to [refer to the spec](https://tools.ietf.org/html/rfc4566).

 - when do I need to care
 - how does spool relate


## Tying It All Together With Spool

TODO


### meta

-  Customer intent statements: 
   - I want to know what WebRTC protocols are and how they relate to spool.

- Discussion:
  - Is anything else needed here?
  - How should we articulate how spool ties it all together?
  - What tutorials / quickstarts / concepts should be referenced within this page?
  - Is this technically accurate?


