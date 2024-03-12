---
title: What is a Network Security Perimeter?
description: Learn about the components of a network security perimeter, a feature that allows Azure PaaS resources to communicate within an explicit trusted boundary.
author: mbender-ms
ms.author: mbender
ms.service: private-link
ms.topic: overview
ms.date: 02/21/2024
#CustomerIntent: As a network security administrator, I want to understand how to use Network Security Perimeter to control network access to Azure PaaS resources.
---

# What is a Network Security Perimeter?

Network security perimeter is an offering which provides a secure perimeter for communication of PaaS services deployed outside the virtual network. 

•	All resources inside perimeter can communicate with any other resource within perimeter.  
•	For external access the following controls are available 
o	Public inbound access can be approved using Network and Identity attributes of the client such as source IP addresses, subscriptions.  
o	Public outbound can be approved using FQDNs (Fully Qualified Domain Names) of the external destinations. 
•	Diagnostic Logs is enabled for PaaS resources within perimeter for Audit and Compliance. 
•	Resources in Private Endpoints can additionally accept communication from customer virtual networks, both network security perimeter and Private Endpoints are independent controls. 

## Network security perimeter properties

## Concepts within network security perimeter

## Modes in network security perimeter

## Impact on public, private, trusted, and perimeter access

## Transitioning to a secure perimeter configuration

## Private-link resource

## Limitations of network security perimeter

### Regional limitations

### Scale limitations

### Other limitations

## Pricing

Network security perimeter is a free offering available to all customers.

## Next steps