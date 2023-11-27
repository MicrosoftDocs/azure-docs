---
title: Manage SFTP Ingestion Agents for Azure Operator Insights
description: Learn how to upgrade, update, roll back and manage SFTP Ingestion agents for AOI
author: rcdun
ms.author: rdunstan
ms.service: operator-insights
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 12/06/2023
---

# Manage SFTP Ingestion Agents for Azure Operator Insights

> [!TIP]
> When the agent restarts, each configured file source performs an immediate catch-up upload run. Subsequent upload runs take place according to the configured schedule for each file source.

## Agent software upgrade

To upgrade to a new release of the agent, repeat the following steps on each VM that has the old agent.

1. Copy the RPM to the VM.  In an SSH session, change to the directory where the RPM was copied.

2. Save a copy of the existing */etc/az-sftp-uploader/config.yaml* configuration file.

3. Upgrade the RPM: `sudo dnf install \*.rpm`.  Answer 'y' when prompted.  

4. Create a new config file based on the new sample, keeping values from the original. Follow specific instructions in the release notes for the upgrade to ensure the new configuration is generated correctly. 

5. Restart the agent: `sudo systemctl restart az-sftp-uploader.service`

6. Once the agent is running, configure the az-sftp-uploader service to automatically start on a reboot: `sudo systemctl enable az-sftp-uploader.service`
7. Verify that the agent is running and that it's copying files as described in [Monitor and troubleshoot SFTP Ingestion Agents for Azure Operator Insights](troubleshoot-sftp-agent.md).

## Agent configuration update

If you need to change the agent's configuration, perform the following steps:

1. Save a copy of the original configuration file */etc/az-sftp-uploader/config.yaml*

2. Edit the configuration file to change the config values.  

> [!WARNING]
> If you change the `source_id` for a file source, the agent  treats it as a new file source and might upload duplicate files with the new `source_id`. To avoid this, add the `exclude_before_time` parameter to the file source configuration. For example, if you configure `exclude_before_time: "2024-01-01T00:00:00-00:00"` then any files last modified before midnight on January 1, 2024 UTC will be ignored by the agent.

3. Restart the agent: `sudo systemctl restart az-sftp-uploader.service`

## Rollback

If an upgrade or configuration change fails:

1. Copy the backed-up configuration file from before the change to the */etc/az-sftp-uploader/config.yaml* file.

1. If a software upgrade failed, downgrade back to the original RPM.

1. Restart the agent: `sudo systemctl restart az-sftp-uploader.service`

1. If this was software upgrade, configure the az-sftp-uploader service to automatically start on a reboot: `sudo systemctl enable az-sftp-uploader.service`

## Certificate rotation

You must refresh your service principal credentials before they expire.

To do so:

1. Create a new certificate, and add it to the service principal. For instructions, refer to [Upload a trusted certificate issued by a certificate authority](/entra/identity-platform/howto-create-service-principal-portal).

1. Obtain the new certificate and private key in the base64-encoded PKCS12 format, as described in [Create and configure SFTP Ingestion Agents for Azure Operator Insights](how-to-install-sftp-agent.md).

1. Copy the certificate to the ingestion agent VM.

1. Save the existing certificate file and replace with the new certificate file.

1. Restart the agent: `sudo systemctl restart az-sftp-uploader.service`