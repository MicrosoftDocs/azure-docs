---
title: Manage MCC CDR Ingestion Agents for Azure Operator Insights
description: Learn how to upgrade, update, roll back and manage MCC CDR Ingestion agents for AOI
author: rcdun
ms.author: rdunstan
ms.service: operator-insights
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 12/06/2023
---

# Manage SFTP Ingestion Agents for Azure Operator Insights

> [!WARNING]
> When the agent is restarted, a small number of EDRs being handled may be dropped.  It is not possible to gracefully restart without dropping any data.  For safety, update agents one at a time, only updating the next when you are sure the previous was successful.

## Agent software upgrade

To upgrade to a new release of the agent, repeat the following steps on each VM that has the old agent.

> [!WARNING]
> When the agent restarts, a small number of EDRs being handled may be dropped.  It is not possible to gracefully upgrade without dropping any data.  For safety, upgrade agents one at a time, only upgrading the next when you are sure the previous was successful.

1. Copy the RPM to the VM.  In an SSH session, change to the directory where the RPM was copied.

1. Save a copy of the existing */etc/az-mcc-edr-uploader/config.yaml* configuration file.

1. Upgrade the RPM: `sudo dnf install \*.rpm`.  Answer 'y' when prompted.  

1. Create a new config file based on the new sample, keeping values from the original. Follow specific instructions in the release notes for the upgrade to ensure the new configuration is generated correctly. 

1. Restart the agent: `sudo systemctl restart az-mcc-edr-uploader.service`

1. Once the agent is running, make sure it will automatically start on a reboot: `sudo systemctl enable az-mcc-edr-uploader.service`
1. Verify that the agent is running and that EDRs are being routed to it as described in [Monitor and troubleshoot MCC EDR Ingestion Agents for Azure Operator Insights](troubleshoot-mcc-edr-agent.md).

### Agent configuration update

> [!WARNING]
> Changing the configuration requires restarting the agent, whereupon a small number of EDRs being handled may be dropped.  It is not possible to gracefully restart without dropping any data.  For safety, update agents one at a time, only updating the next when you are sure the previous was successful.

If you need to change the agent's configuration, perform the following steps:

1. Save a copy of the original configuration file */etc/az-mcc-edr-uploader/config.yaml*

1. Edit the configuration file to change the config values.  

1. Restart the agent: `sudo systemctl restart az-mcc-edr-uploader.service`

### Rollback

If an upgrade or configuration change fails:

1. Copy the backed-up configuration file from before the change to the */etc/az-mcc-edr-uploader/config.yaml* file.

1. If a software upgrade failed, downgrade back to the original RPM.

1. Restart the agent: `sudo systemctl restart az-mcc-edr-uploader.service`

1. If this was software upgrade, make sure it will automatically start on a reboot: `sudo systemctl enable az-mcc-edr-uploader.service`

## Certificate rotation

You must refresh your service principal credentials before they expire.

To do so:

1. Create a new certificate, and add it to the service principal. For instructions, refer to [Upload a trusted certificate issued by a certificate authority](/entra/identity-platform/howto-create-service-principal-portal).

1. Obtain the new certificate and private key in the base64-encoded PKCS12 format, as described in [Create and configure MCC EDR Ingestion Agents for Azure Operator Insights](how-to-install-mcc-edr-agent.md).

1. Copy the certificate to the ingestion agent VM.

1. Save the existing certificate file and replace with the new certificate file.

1. Restart the agent: `sudo systemctl restart az-mcc-edr-uploader.service`
