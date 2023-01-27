---
title: Monitoring options - Azure Dedicated HSM | Microsoft Docs
description: Overview of Azure Dedicated HSM monitoring options and monitoring responsibilities
services: dedicated-hsm
author: msmbaldwin
manager: rkarlin
ms.custom: "mvc, seodec18"
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/14/2022
ms.author: mbaldwin

---

# Azure Dedicated HSM monitoring

The Azure Dedicated HSM Service provides a physical device for sole customer use with complete administrative control and management responsibility. The device made available is a [Thales Luna 7 HSM model A790](https://cpl.thalesgroup.com/encryption/hardware-security-modules/network-hsms).  Microsoft will have no administrative access once provisioned by a customer, beyond physical serial port attachment as a monitoring role. As a result, customers are responsible for typical operational activities including comprehensive monitoring and log analysis.
Customers are fully responsible for applications that use the HSMs and should work with Thales for support or consulting assistance. Due to the extent of customer ownership of operational hygiene, it is not possible for Microsoft to offer any kind of high availability guarantee for this service. It is the customer’s responsibility to ensure their applications are correctly configured to achieve high availability. Microsoft will monitor and maintain device health and network connectivity.

## Microsoft monitoring

The Thales Luna 7 HSM device in use has by default SNMP and serial port as options for monitoring the device. Microsoft has used the serial port connection as a physical means to connect to the device to retrieve basic telemetry on device health. This includes items such as temperature and component status such as power supplies and fans.
To achieve this, Microsoft uses a non-administrative “monitor” role set up on the Thales device. This role gives the ability to retrieve the telemetry but does not give any access to the device in terms of administrative task or in any way viewing cryptographic information. Our customers can be assured their device is truly their own to manage, administer, and use for sensitive cryptographic key storage. In case any customer is not satisfied with this minimal access for basic health monitoring, they do have the option to disable the monitoring account. The obvious consequence of this is that Microsoft will have no information and hence no ability to provide any proactive notification of device health issues. In this situation, the customer is responsible for the health of the device.
The monitor function itself is set up to poll the device every 10 minutes to get health data. Due to the error prone nature of serial communications, only after multiple negative health indicators over a one hour period would an alert be raised. This alert would ultimately lead to a proactive customer communication notifying the issue.
Depending on the nature of the issue, the appropriate course of action would be taken to reduce impact and ensure low risk remediation. For example, a power supply failure is a hot-swap procedure with no resultant tamper event so can be performed with low impact and minimal risk to operation. Other procedures may require a device to be zeroized and deprovisioned to minimize any security risk to the customer. In this situation a customer would provision an alternate device, rejoin a high availability pairing thus triggering device synchronization. Normal operation would resume in minimal time, with minimal disruption and lowest security risk.  

## Customer monitoring

A value proposition of the Dedicated HSM service is the control the customer gets of the device, especially considering it is a cloud delivered device. A consequence of this control is the responsibility to monitor and manage the health of the device. 
The Thales Luna 7 HSM device comes with guidance for SNMP and Syslog implementation. Customers of the Dedicated HSM service are recommended to use this even when the Microsoft monitor account remains active and should consider it mandatory if they disable the Microsoft monitor account.
Either technique available would allow a customer to identify issues and call Microsoft support to initiate appropriate remediation work.

## Next steps

It is recommended that all key concepts of the service, such as high availability and security for example, are well understood before any device provisioning and application design or deployment. Further concept level topics:

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
