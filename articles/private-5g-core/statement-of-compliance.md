---
title: Statement of compliance
titleSuffix: Azure Private 5G Core
description: Information on Azure Private 5G Core's compliance with specifications. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 01/20/2022
ms.custom: template-concept
---

# Statement of compliance - Azure Private 5G Core

This article provides information on the standards for which Azure Private 5G Core provides support.

## 3GPP specifications

All packet core network functions are compliant with Release 15 of the 3GPP specifications listed. Several of the network functions can play the role of both the service consumer and service producer to adhere to these standards.

### 5G system (5GS)

- TS 23.003: Numbering, addressing and identification.
- TS 23.501: System architecture for the 5G System (5GS).
- TS 23.502: Procedures for the 5G System (5GS).

### 4G system

- TS 23.002: Network architecture.
- TS 23.401: General Packet Radio Service (GPRS) enhancements for Evolved Universal Terrestrial Radio Access Network (E-UTRAN) access.
- TS 29.272: Evolved Packet System (EPS); Mobility Management Entity (MME) and Serving GPRS Support Node (SGSN) related interfaces based on Diameter protocol.
- TS 29.274: 3GPP Evolved Packet System (EPS); Evolved General Packet Radio Service (GPRS) Tunneling Protocol for Control plane (GTPv2-C); Stage 3.
- TS 33.401: 3GPP System Architecture Evolution (SAE); Security architecture.
- TS 36.413: Evolved Universal Terrestrial Radio Access Network (E-UTRAN); S1 Application Protocol (S1AP).

### 5G handover procedures

- TS 23.502: Procedures for the 5G System (5GS):
  - 4.9.1.2: Xn based inter NG-RAN handover.
  - 4.9.1.3: Inter NG-RAN node N2 based handover.

### 4G handover procedures

- TS 23.401: General Packet Radio Service (GPRS) enhancements for Evolved Universal Terrestrial Radio Access Network (E-UTRAN) access: 
  - 5.5.1.1 X2-based handover.

### Policy and charging control (PCC) framework

- TS 23.503: Policy and charging control framework for the 5G System (5GS); Stage 2.
- TS 29.212: Policy and Charging Control (PCC); Reference points.
- TS 29.513: 5G System; Policy and Charging Control signaling flows and QoS parameter mapping; Stage 3.
- TS 29.519: 5G System; Usage of the Unified Data Repository Service for Policy Data, Application Data and Structured Data for Exposure; Stage 3.

### User plane

- TS 29.281: General Packet Radio System (GPRS) Tunneling Protocol User Plane (GTPv1-U).
- TS 38.415: NG-RAN; PDU session user plane protocol.

### Non-access stratum (NAS) protocol / NG Application Protocol (NGAP)

- TS 24.501: Non-Access-Stratum (NAS) protocol for 5G System (5GS); Stage 3.
- TS 38.410: NG-RAN; NG general aspects and principles (NGAP).
- TS 38.413: NG-RAN; NG Application Protocol (NGAP).

### Service-based interfaces

- TS 29.500: 5G System; Technical Realization of Service Based Architecture; Stage 3.
- TS 29.501: 5G System; Principles and Guidelines for Services Definition; Stage 3.
- TS 29.512: 5G System; Session Management Policy Control Service; Stage 3.
- TS 29.571: 5G System; Common Data Types for Service Based Interfaces; Stage 3.

### Service-based interface exposure

- SMF - TS 29.502: 5G System; Session Management Services; Stage 3.
- UDM - TS 29.503: 5G System; Unified Data Management Services; Stage 3.
- UDR
  - TS 29.504: 5G System; Unified Data Repository Services; Stage 3.
  - TS 29.505: 5G System; Usage of the Unified Data Repository services for Subscription Data; Stage 3.
- AUSF - TS 29.509: 5G System; Authentication Server Services; Stage 3.
- AMF - TS 29.518: 5G System; Access and Mobility Management Services; Stage 3.

### Security

- TS 33.102: 3G security; Security architecture.
- TS 33.220: Generic Authentication Architecture (GAA); Generic Bootstrapping Architecture (GBA).
- TS 33.501: Security architecture and procedures for 5G System.
- TS 35.206: 3G Security; Specification of the MILENAGE algorithm set: An example algorithm set for the 3GPP authentication and key generation functions f1, f1*, f2, f3, f4, f5 and f5*; Document 2: Algorithm specification.

## IETF RFCs

The implementation of all of the 3GPP specifications given in [3GPP specifications](#3gpp-specifications) is compliant with the following IETF RFCs:

- IETF RFC 768: User Datagram Protocol.
- IETF RFC 791: Internet Protocol.
- IETF RFC 2279: UTF-8, a transformation format of ISO 10646.
- IETF RFC 2460: Internet Protocol, Version 6 (IPv6) Specification.
- IETF RFC 2474: Definition of the Differentiated Services Field (DS Field) in the IPv4 and IPv6 Headers.
- IETF RFC 3986: Uniform Resource Identifier (URI): Generic Syntax.
- IETF RFC 4291: IP Version 6 Addressing Architecture.
- IETF RFC 4960: Stream Control Transmission Protocol.
- IETF RFC 5789: PATCH Method for HTTP.
- IETF RFC 6458: Sockets API Extensions for the Stream Control Transmission Protocol (SCTP).
- IETF RFC 6733: Diameter Base Protocol.
- IETF RFC 6749: The OAuth 2.0 Authorization Framework.
- IETF RFC 6902: JavaScript Object Notation (JSON) Patch.
- IETF RFC 7396: JSON Merge Patch.
- IETF RFC 7540: Hypertext Transfer Protocol Version 2 (HTTP/2).
- IETF RFC 7807: Problem Details for HTTP APIs.
- IETF RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format.

## ITU-T Recommendations

The implementation of all of the 3GPP specifications given in [3GPP specifications](#3gpp-specifications) is compliant with the following ITU-T Recommendations:

- ITU-T Recommendation E.164: The international public telecommunication numbering plan.
- ITU-T Recommendation E.212: The international identification plan for public networks and subscriptions.
- ITU-T Recommendation E.213: Telephone and ISDN numbering plan for land Mobile Stations in public land mobile networks (PLMN).
- ITU-T Recommendation X.121: International numbering plan for public data networks.

## Next steps

- [Learn more about Azure Private 5G Core](private-5g-core-overview.md)
- [Learn more about the prerequisites for deploying a private mobile network](complete-private-mobile-network-prerequisites.md)
