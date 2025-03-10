---
title: Microsoft Azure Data Box security overview | Microsoft Docs in data 
description: Describes Azure Data Box security features in the device, service, and data that resides on Data Box.
services: databox
author: stevenmatthew

ms.service: azure-databox
ms.topic: overview
ms.date: 04/13/2022
ms.author: shaas
---
# Azure Data Box security and data protection

Data Box provides a secure solution for data protection by ensuring that only authorized entities can view, modify, or delete your data. This article describes the Azure Data Box security features that help protect each of the Data Box solution components and the data stored on them.

[!INCLUDE [GDPR-related guidance](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

## Data flow through components

The Microsoft Azure Data Box solution consists of four main components that interact with each other:

- **Azure Data Box service hosted in Azure** – The management service that you use to create the device order, configure the device, and then track the order to completion.
- **Data Box device** – The transfer device that is shipped to you to import your on-premises data into Azure.
- **Clients/hosts connected to the device** – The clients in your infrastructure that connect to the Data Box device and contain data that needs to be protected.
- **Cloud storage** – The location in the Azure cloud where data is stored. That location is typically the storage account linked to the Azure Data Box resource that you created.

The following diagram indicates the flow of data through the Azure Data Box solution from on-premises to Azure and the various security features in place as the data flows through the solution. This flow is for an import order for your Data Box.

![Data Box import security](media/data-box-security/data-box-security-import.png)

The following diagram is for the export order for your Data Box.

![Data Box export security](media/data-box-security/data-box-security-export.png)

As the data flows through this solution, events are logged and logs are generated. For more information, go to:

- [Tracking and event logging for your Azure Data Box import orders](data-box-logs.md).
- [Tracking and event logging for your Azure Data Box export orders](data-box-export-logs.md)

## Security features

Data Box provides a secure solution for data protection by ensuring that only authorized entities can view, modify, or delete your data. The security features for this solution are for the disk and for the associated service ensuring the security of the data stored on them.

### Data Box device protection

The Data Box device is protected by the following features:

- A rugged device casing that withstands shocks, adverse transportation, and environmental conditions. 
- Hardware and software tampering detection that prevents further device operations.
- A Trusted Platform Module (TPM) that performs hardware-based, security-related functions. Specifically, the TPM manages and protects secrets and data that needs to be persisted on the device.
- Runs only Data Box-specific software.
- Boots up in a locked state.
- Controls device access via a device unlock passkey. This passkey is protected by an encryption key. You can use your own customer-managed key to protect the passkey. For more information, see [Use customer-managed keys in Azure Key Vault for Azure Data Box](data-box-customer-managed-encryption-key-portal.md).
- Access credentials to copy data in and out of the device. Each access to the **Device credentials** page in the Azure portal is logged in the [activity logs](data-box-logs.md#query-activity-logs-during-setup).
- You can use your own passwords for device and share access. For more information, see [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).

### Establish trust with the device via certificates

A Data Box device lets you bring your own certificates and install those to be used for connecting to the local web UI and blob storage. For more information, see [Use your own certificates with Data Box and Data Box Heavy devices](data-box-bring-your-own-certificates.md).

### Data Box data protection

The data that flows in and out of Data Box is protected by the following features:

- AES 256-bit encryption for Data-at-rest. In a high-security environment, you can use software-based double encryption. For more information, see [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).
- Encrypted protocols can be used for data-in-flight. We recommend that you use SMB 3.0 with encryption to protect data when you copy to it from your data servers.
- Secure erasure of data from the device once upload to Azure is complete. Data erasure is in accordance with guidelines in [Appendix A for ATA Hard Disk Drives in NIST 800-88r1 standards](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r1.pdf). The data erasure event is recorded in the [order history](data-box-logs.md#download-order-history).

### Data Box service protection

The Data Box service is protected by the following features.

- Access to the Data Box service requires that your organization have an Azure subscription that includes Data Box. Your subscription governs the features that you can access in the Azure portal.
- Because the Data Box service is hosted in Azure, it is protected by the Azure security features. For more information about the security features provided by Microsoft Azure, go to the [Microsoft Azure Trust Center](https://www.microsoft.com/TrustCenter/Security/default.aspx).
- Access to the Data Box order can be controlled via the use of Azure roles. For more information, see [Set up access control for Data Box order](data-box-logs.md#set-up-access-control-on-the-order)
- The Data Box service stores the unlock password that is used to unlock the device in the service.
- The Data box service stores order details and status in the service. This information is deleted when the order is deleted.

## Managing personal data

Azure Data Box collects and displays personal information in the following key instances in the service:

- **Notification settings** - When you create an order, you configure the email address of users under notification settings. This information can be viewed by the administrator. This information is deleted by the service when the job reaches the terminal state or when you delete the order.

- **Order details** – Once the order is created, the shipping address, email, and contact information of users is stored in the Azure portal. The information saved includes:

  - Contact name
  - Phone number
  - Email
  - Street address
  - City
  - Zip/postal code
  - State
  - Country/Province/Region
  - Carrier account number
  - Shipping tracking number

    The order details are deleted by the Data Box service when the job completes or when you delete the order.

- **Shipping address** – After the order is placed, Data Box service provides the shipping address to third-party carriers such as UPS or DHL. 

For more information, review the Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trust-center).


## Security guidelines reference

The following security guidelines are implemented in Data Box:

|Guideline   |Description   |
|---------|---------|
|[IEC 60529 IP52](https://www.iec.ch/)    | For water and dust protection         |
|[ISTA 2A](https://ista.org/docs/2Aoverview.pdf)     | For adverse transport conditions endurance          |
|[NIST SP 800-147](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-147.pdf)      | For secure firmware update         |
|[FIPS 140-2 Level 2](https://csrc.nist.gov/csrc/media/publications/fips/140/2/final/documents/fips1402.pdf)      | For data protection         |
|Appendix A, for ATA Hard Disk Drives in [NIST SP 800-88r1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r1.pdf)      | For data sanitization         |

## Next steps

- Review the [Data Box requirements](data-box-system-requirements.md).
- Understand the [Data Box limits](data-box-limits.md).
- Quickly deploy [Azure Data Box](data-box-quickstart-portal.md) in Azure portal.
