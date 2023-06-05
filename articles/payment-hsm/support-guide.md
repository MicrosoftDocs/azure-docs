---
title: Azure Payment HSM Service support guide
description: Azure Payment HSM Service support guide
services: payment-hsm
author: msmbaldwin

tags: azure-resource-manager
ms.service: payment-hsm
ms.workload: security
ms.topic: article
ms.date: 07/28/2022
ms.author: mbaldwin
---

# Azure Payment HSM service support guide

This article outlines the Azure Payment HSM prerequisites, support channels, and division of support responsibility between Microsoft, Thales, and the customer.

> [!NOTE]
> If a customer's production environment does not has a High Availability setup as shown in [Deployment scenarios: high availability deployment](deployment-scenarios.md#high-availability-deployment), customer will not receive S2 level support.

## Prerequisites

Microsoft will work with Thales to ensure that customers meet the prerequisites before starting the onboarding process.

- Customers must have access to the [Thales CPL Customer Support Portal](https://supportportal.thalesgroup.com/csm) (Customer ID).
- Customers must have Thales smart cards and card readers for payShield Manager. If a customer need to purchase smart cards or card readers they should contact their Thales representatives, or find their contacts through the [Thales contact page](https://cpl.thalesgroup.com/contact-us).
- If a customer need to purchase a payShield Trusted Management Device (TMD), they should contact their Thales representatives or find their contacts through the [Thales contact page](https://cpl.thalesgroup.com/contact-us).
- Customers must download and review the "Hosted HSM End User Guide", which is available through the Thales CPL Customer Support Portal. The Hosted HSM End User Guide will provide more details on the changes to payShield to this service.
- Customers must review the "Azure Payment HSM - Get Ready for payShield 10K" guide that they received from Microsoft. (Customers who do not have the guide may request it from [Microsoft Support](#microsoft-support).)
- If a customer is new to payShield or the remote management option, they should take the formal training courses available from Thales and its approved partners.
- If a customer is using payShield on premises today with custom firmware, they must conduct a porting exercise to update the firmware to a version compatible with the Azure deployment. Contact a Thales account manager to request a quote.

## Firmware and license support

The HSM base firmware installed is Thales payShield10K base software version 1.4a 1.8.3 with the Premium Package license. Versions below 1.4a 1.8.3. are not supported. Customers must ensure that they only upgrade to a firmware version that meets their compliance requirements.

The Premium Package license included in Azure payment HSM features: 
- Premium Key Management
- Magnetic Stripe Issuing 
- Magnetic Stripe Transaction Processing
- EMV Chip, Contactless & Mobile Issuing 
- EMV Transaction Processing 
- Premium Data Protection 
- Remote payShield Manager
- Hosted HSM

Customers are responsible for applying payShield security patches and upgrading payShield firmware for their provisioned HSMs, as needed. If customers have questions or require assistance, they should work with Thales support.

Microsoft is responsible for applying payShield security patches to unallocated HSMs.  

## Microsoft support

Microsoft will provide support for hardware issues, networking issues, and provisioning issues. Enterprise customers should contact their CSAM to find out details of their support contract .

Microsoft support can be contacted by creating a support ticket through the Azure portal:

- From the Azure portal homepage, select the "Support + troubleshooting" icon (a question mark in a circle) in the upper-right.
- Select the "Help + Support" button.
- Select "Create a support request".
- On the "New support request" screen, select "Technical" as your issue type, and then "Payment HSM" as the service type. 

## Thales support

Thales will provide payment application-level support including client software, HSM configuration and backup, and HSM operation support.

All Azure Payment HSM customers have Enhanced Support Plan with Thales. The [Thales Welcome Pack for Authentication and Encryption Products](https://supportportal.thalesgroup.com/csm?sys_kb_id=1d2bac074f13f340102400818110c7d9&id=kb_article_view&sysparm_rank=1&sysparm_tsqueryId=e7f1843d87f3c9107b0664e80cbb352e&sysparm_article=KB0019882) is an important reference for customers, as it explains the Thales support plan, scope, and responsiveness. Download the [Thales Welcome Pack PDF](https://supportportal.thalesgroup.com/sys_attachment.do?sys_id=52681fca1b1e0110e2af520f6e4bcb96).

Thales support can be contacted through the [Thales CPL Customer Support Portal](https://supportportal.thalesgroup.com/csm).

## Support contacts

Depending on the nature of your issue or query, you may need to contact Microsoft and/or Thales support. The table below provides high level guidance. When you do not know where to get support, contact Microsoft support first.

| Issues | Microsoft Support | Thales Support | Additional Information |
|--|--|--|--|
| HSM provisioning, HSM networking, HSM hardware, management and host port connection | X | | |
| HSM reset, HSM delete | X | | |
| HSM Tamper event | X | | Microsoft can recover logs from medium Tamper based on customer's request. It is highly recommended that you implement real time log replication and backup. |
| payShield manager operation, key management | | X | |
| payShield applications, host commands | | X | |
| payShield firmware upgrade, security patch | | X | Customers are responsible for upgrading their allocated HSM's firmware and applying security patches. Firmware versions below 1.4a 1.8.3. are not supported.<br><br>Microsoft is responsible for applying payShield security patches to unallocated HSMs. |
| Smart card, Card Readers | | X | Customers can purchase smart cards and readers through their Thales representatives. |
| TMD | | X | The customer can purchase TMD through their Thales representatives. |
| Hosted HSM End User Guide | | X | Customers must download "Hosted HSM End User Guide" from Thales support portal for more details on the changes to payShield to this service. |
| payShield 10K documentation, TMD documentation | | X | |
| payShield audit and error logs backup | N/A | N/A | The customer is responsible for implementing their own mechanism to back up their audit and error logs. It is highly recommended that you implement real time log replication and backup. |
| Key backup | N/A | N/A | Customers are responsible to implement their own mechanism to back up keys. |
| Custom firmware | | X | If customers are using payShield on premise today with a custom firmware, a porting exercise is required to update the firmware to a version compatible with the Azure deployment. Contact Thales account manager to request a quote. Custom firmware will be supported by Thales support. |

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
