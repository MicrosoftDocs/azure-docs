---
title: Reference table for all security recommendations for GCP resources
description: This article lists all Microsoft Defender for Cloud security recommendations that help you harden and protect your Google Cloud Platform (GCP) resources.
ms.topic: reference
ms.date: 03/13/2024
ms.custom: generated
ai-usage: ai-assisted
---

# Security recommendations for Google Cloud Platform (GCP) resources

This article lists all the recommendations you might see in Microsoft Defender for Cloud if you connect a Google Cloud Platform (GCP) account by using the **Environment settings** page. The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).

Your secure score is based on the number of security recommendations you completed. To decide which recommendations to resolve first, look at the severity of each recommendation and its potential effect on your secure score.

## GCP Compute recommendations

### [Compute Engine VMs should use the Container-Optimized OS](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3e33004b-f0b8-488d-85ed-61336c7ad4ca)

**Description**: This recommendation evaluates the config property of a node pool for the key-value pair, 'imageType': 'COS.'

**Severity**: Low

### [EDR configuration issues should be resolved on GCP virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f36a15fb-61a6-428c-b719-6319538ecfbc)

**Description**: To protect virtual machines from the latest threats and vulnerabilities, resolve all identified configuration issues with the installed Endpoint Detection and Response (EDR) solution. <br> Note: Currently, this recommendation only applies to resources with Microsoft Defender for Endpoint (MDE) enabled.

**Severity**: High

### [EDR solution should be installed on GCP Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/68e595c1-a031-4354-b37c-4bdf679732f1)

**Description**: To protect virtual machines, install an Endpoint Detection and Response (EDR) solution. EDRs help prevent, detect, investigate, and respond to advanced threats. Use Microsoft Defender for Servers to deploy Microsoft Defender for Endpoint. If resource is classified as "Unhealthy", it doesn't have a supported EDR solution installed [Place Holder link - Learn more]. If you have an EDR solution installed which isn't discoverable by this recommendation, you can exempt it.

**Severity**: High

### [Ensure 'Block Project-wide SSH keys' is enabled for VM instances](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/00f8a6a6-cf69-4c11-822e-3ebf4910e545)

**Description**: It's recommended to use Instance specific SSH key(s) instead of using common/shared project-wide SSH key(s) to access Instances.
Project-wide SSH keys are stored in Compute/Project-meta-data. Project wide SSH keys can be used to log in into all the instances within project. Using project-wide SSH keys eases the SSH key management but if compromised, poses the security risk that can affect all the instances within project.
 It's recommended to use Instance specific SSH keys that can limit the attack surface if the SSH keys are compromised.

**Severity**: Medium

### [Ensure Compute instances are launched with Shielded VM enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1a4b3b3a-7de9-4aa4-a29b-580d59b43f79)

**Description**: To defend against advanced threats and ensure that the boot loader and firmware on your VMs are signed and untampered, it's recommended that Compute instances are launched with Shielded VM enabled.
Shielded VMs are virtual machines (VMs) on Google Cloud Platform hardened by a set of security controls that help defend against rootkits and bootkits.
Shielded VM offers verifiable integrity of your Compute Engine VM instances, so you can be confident your instances haven't been compromised by boot- or kernel-level malware or rootkits.
Shielded VM's verifiable integrity is achieved through the use of Secure Boot, virtual trusted platform module (vTPM)-enabled Measured Boot, and integrity monitoring.
Shielded VM instances run firmware that is signed and verified using Google's Certificate Authority, ensuring that the instance's firmware is unmodified and establishing the root of trust for Secure Boot.
Integrity monitoring helps you understand and make decisions about the state of your VM instances and the Shielded VM vTPM enables Measured Boot by performing the measurements needed to create a known good boot baseline, called the integrity policy baseline.
The integrity policy baseline is used for comparison with measurements from subsequent VM boots to determine if anything has changed.
Secure Boot helps ensure that the system only runs authentic software by verifying the digital signature of all boot components, and halting the boot process if signature verification fails.

**Severity**: High

### [Ensure 'Enable connecting to serial ports' is not enabled for VM Instance](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7e060336-2c9e-4289-a2a6-8d301bad47bb)

**Description**: Interacting with a serial port is often referred to as the serial console, which is similar to using a terminal window, in that input and output is entirely in text mode and there's no graphical interface or mouse support.
If you enable the interactive serial console on an instance, clients can attempt to connect to that instance from any IP address. Therefore interactive serial console support should be disabled.
A virtual machine instance has four virtual serial ports. Interacting with a serial port is similar to using a terminal window, in that input and output is entirely in text mode and there's no graphical interface or mouse support.
The instance's operating system, BIOS, and other system-level entities often write output to the serial ports, and can accept input such as commands or answers to prompts.
Typically, these system-level entities use the first serial port (port 1) and serial port 1 is often referred to as the serial console.
The interactive serial console doesn't support IP-based access restrictions such as IP allowlists. If you enable the interactive serial console on an instance, clients can attempt to connect to that instance from any IP address.
This allows anybody to connect to that instance if they know the correct SSH key, username, project ID, zone, and instance name.
Therefore interactive serial console support should be disabled.

**Severity**: Medium

### [Ensure 'log_duration' database flag for Cloud SQL PostgreSQL instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/272820a7-06ce-44b3-8318-4ec1f82237dc)

**Description**: Enabling the log_hostname setting causes the duration of each completed statement to be logged.
 This doesn't logs the text of the query and thus behaves different from the log_min_duration_statement flag.
 This parameter can't be changed after session start.
 Monitoring the time taken to execute the queries can be crucial in identifying any resource hogging queries and assessing the performance of the server.
 Further steps such as load balancing and use of optimized queries can be taken to ensure the performance and stability of the server.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_executor_stats' database flag for Cloud SQL PostgreSQL instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/19711549-76eb-4f1f-b43b-b1048e66c1f0)

**Description**: The PostgreSQL executor is responsible to execute the plan handed over by the PostgreSQL planner.
 The executor processes the plan recursively to extract the required set of rows.
 The "log_executor_stats" flag controls the inclusion of PostgreSQL executor performance statistics in the PostgreSQL logs for each query.
 The "log_executor_stats" flag enables a crude profiling method for logging PostgreSQL executor performance statistics, which even though can be useful for troubleshooting, it might increase the amount of logs significantly and have performance overhead.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_min_error_statement' database flag for Cloud SQL PostgreSQL instance is set to 'Error' or stricter](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/50a1058e-925b-4998-9d93-5eaa8f7021a3)

**Description**: The "log_min_error_statement" flag defines the minimum message severity level that are considered as an error statement.
 Messages for error statements are logged with the SQL statement.
 Valid values include "DEBUG5," "DEBUG4," "DEBUG3," "DEBUG2," "DEBUG1," "INFO," "NOTICE," "WARNING," "ERROR," "LOG," "FATAL," and "PANIC."
 Each severity level includes the subsequent levels mentioned above.
 Ensure a value of ERROR or stricter is set.
 Auditing helps in troubleshooting operational problems and also permits forensic analysis.
 If "log_min_error_statement" isn't set to the correct value, messages might not be classified as error messages appropriately.
 Considering general log messages as error messages would make is difficult to find actual errors and considering only stricter severity levels as error messages might skip actual errors to log their SQL statements.
 The "log_min_error_statement" flag should be set to "ERROR" or stricter.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_parser_stats' database flag for Cloud SQL PostgreSQL instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a6efc275-b1c1-4003-8e85-2f30b2eb56e6)

**Description**: The PostgreSQL planner/optimizer is responsible to parse and verify the syntax of each query received by the server.
 If the syntax is correct a "parse tree" is built up else an error is generated.
 The "log_parser_stats" flag controls the inclusion of parser performance statistics in the PostgreSQL logs for each query.
 The "log_parser_stats" flag enables a crude profiling method for logging parser performance statistics, which even though can be useful for troubleshooting, it might increase the amount of logs significantly and have performance overhead.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_planner_stats' database flag for Cloud SQL PostgreSQL instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7d87879a-d498-4e61-b552-b34463f87f83)

**Description**: The same SQL query can be executed in multiple ways and still produce different results.
 The PostgreSQL planner/optimizer is responsible to create an optimal execution plan for each query.
 The "log_planner_stats" flag controls the inclusion of PostgreSQL planner performance statistics in the PostgreSQL logs for each query.
 The "log_planner_stats" flag enables a crude profiling method for logging PostgreSQL planner performance statistics, which even though can be useful for troubleshooting, it might increase the amount of logs significantly and have performance overhead.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_statement_stats' database flag for Cloud SQL PostgreSQL instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c36e73b7-ee30-4684-a1ad-2b878d2b10bf)

**Description**: The "log_statement_stats" flag controls the inclusion of end to end performance statistics of a SQL query in the PostgreSQL logs for each query.
 This can't be enabled with other module statistics (*log_parser_stats*, *log_planner_stats*, *log_executor_stats*).
 The "log_statement_stats" flag enables a crude profiling method for logging end to end performance statistics of a SQL query.
 This can be useful for troubleshooting but might increase the amount of logs significantly and have performance overhead.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that Compute instances do not have public IP addresses](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8bdd13ad-a9d2-4910-8b06-9c4cddb55abb)

**Description**: Compute instances shouldn't be configured to have external IP addresses.
To reduce your attack surface, Compute instances shouldn't have public IP addresses. Instead, instances should be configured behind load balancers, to minimize the instance's exposure to the internet.
Instances created by GKE should be excluded because some of them have external IP addresses and can't be changed by editing the instance settings.
These VMs have names that start with *gke-* and are labeled *goog-gke-node*.

**Severity**: High

### [Ensure that instances are not configured to use the default service account](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a107c44c-75e4-4607-b1b0-cd5cfcf249e0)

**Description**: It's recommended to configure your instance to not use the default Compute Engine service account because it has the Editor role on the project.
The default Compute Engine service account has the Editor role on the project, which allows read and write access to most Google Cloud Services.
To defend against privilege escalations if your VM is compromised and prevent an attacker from gaining access to all of your project, it's recommended to not use the default Compute Engine service account.
Instead, you should create a new service account and assigning only the permissions needed by your instance.
The default Compute Engine service account is named `[PROJECT_NUMBER]- compute@developer.gserviceaccount.com`.
VMs created by GKE should be excluded. These VMs have names that start with *gke-* and are labeled *goog-gke-node*.

**Severity**: High

### [Ensure that instances are not configured to use the default service account with full access to all Cloud APIs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a8c1fcf1-ca66-4fc1-b5e6-51d7f4f76782)

**Description**: To support principle of least privileges and prevent potential privilege escalation, it's recommended that instances aren't assigned to default service account "Compute Engine default service account" with Scope "Allow full access to all Cloud APIs."
Along with ability to optionally create, manage, and use user managed custom service accounts, Google Compute Engine provides default service account "Compute Engine default service account" for an instance to access necessary cloud services.
"Project Editor" role is assigned to "Compute Engine default service account" hence, This service account has almost all capabilities over all cloud services except billing.
However, when "Compute Engine default service account" assigned to an instance it can operate in three scopes.

1. Allow default access: Allows only minimum access required to run an Instance (Least Privileges).
1. Allow full access to all Cloud APIs: Allow full access to all the cloud APIs/Services (Too much access).
1. Set access for each API: Allows Instance administrator to choose only those APIs that are needed to perform specific business functionality expected by instance
When an instance is configured with "Compute Engine default service account" with Scope "Allow full access to all Cloud APIs," based on IAM roles assigned to the user(s) accessing Instance,
it might allow user to perform cloud operations/API calls that user isn't supposed to perform leading to successful privilege escalation.
VMs created by GKE should be excluded. These VMs have names that start with "gke-" and are labeled "goog-gke-node."

**Severity**: Medium

### [Ensure that IP forwarding is not enabled on Instances](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0ba588a6-4539-4e67-bc62-d7b2b51300fb)

**Description**: Compute Engine instance can't forward a packet unless the source IP address of the packet matches the IP address of the instance. Similarly, GCP won't deliver a packet whose destination IP address is different than the IP address of the instance receiving the packet.
 However, both capabilities are required if you want to use instances to help route packets.
Forwarding of data packets should be disabled to prevent data loss or information disclosure.
Compute Engine instance can't forward a packet unless the source IP address of the packet matches the IP address of the instance. Similarly, GCP won't deliver a packet whose destination IP address is different than the IP address of the instance receiving the packet.
 However, both capabilities are required if you want to use instances to help route packets. To enable this source and destination IP check, disable the canIpForward field, which allows an instance to send and receive packets with nonmatching destination or source IPs.

**Severity**: Medium

### [Ensure that the 'log_checkpoints' database flag for Cloud SQL PostgreSQL instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a2404629-0132-4ab3-839e-8389dbe9fe98)

**Description**: Ensure that the log_checkpoints database flag for the Cloud SQL PostgreSQL instance is set to on.
Enabling log_checkpoints causes checkpoints and restart points to be logged in the server log. Some statistics are included in the log messages, including the number of buffers written and the time spent writing them.
 This parameter can only be set in the postgresql.conf file or on the server command line. This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that the 'log_lock_waits' database flag for Cloud SQL PostgreSQL instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8191f530-fde7-4177-827a-43ce0f69ffe7)

**Description**: Enabling the "log_lock_waits" flag for a PostgreSQL instance creates a log for any session waits that take longer than the allotted "deadlock_timeout" time to acquire a lock.
 The deadlock timeout defines the time to wait on a lock before checking for any conditions. Frequent run overs on deadlock timeout can be an indication of an underlying issue.
 Logging such waits on locks by enabling the log_lock_waits flag can be used to identify poor performance due to locking delays or if a specially crafted SQL is attempting to starve resources through holding locks for excessive amounts of time.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that the 'log_min_duration_statement' database flag for Cloud SQL PostgreSQL instance is set to '-1'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1c9e237b-419f-4e73-b43a-94b5863dd73e)

**Description**: The "log_min_duration_statement" flag defines the minimum amount of execution time of a statement in milliseconds where the total duration of the statement is logged. Ensure that "log_min_duration_statement" is disabled, that is, a value of -1 is set.
 Logging SQL statements might include sensitive information that shouldn't be recorded in logs. This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that the 'log_min_messages' database flag for Cloud SQL PostgreSQL instance is set appropriately](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/492fed4e-1871-4c12-948d-074ee0f07559)

**Description**: The "log_min_error_statement" flag defines the minimum message severity level that is considered as an error statement.
 Messages for error statements are logged with the SQL statement.
 Valid values include "DEBUG5," "DEBUG4," "DEBUG3," "DEBUG2," "DEBUG1," "INFO," "NOTICE," "WARNING," "ERROR," "LOG," "FATAL," and "PANIC."
 Each severity level includes the subsequent levels mentioned above.
 Note: To effectively turn off logging failing statements, set this parameter to PANIC.
 ERROR is considered the best practice setting. Changes should only be made in accordance with the organization's logging policy.
Auditing helps in troubleshooting operational problems and also permits forensic analysis.
 If "log_min_error_statement" isn't set to the correct value, messages might not be classified as error messages appropriately.
 Considering general log messages as error messages would make it difficult to find actual errors, while considering only stricter severity levels as error messages might skip actual errors to log their SQL statements.
 The "log_min_error_statement" flag should be set in accordance with the organization's logging policy.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that the 'log_temp_files' database flag for Cloud SQL PostgreSQL instance is set to '0'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/29622fc0-14dc-4d65-a5a8-e9a39ffc4b62)

**Description**: PostgreSQL can create a temporary file for actions such as sorting, hashing, and temporary query results when these operations exceed "work_mem."
 The "log_temp_files" flag controls logging names and the file size when it's deleted.
 Configuring "log_temp_files" to 0 causes all temporary file information to be logged, while positive values log only files whose size is greater than or equal to the specified number of kilobytes.
 A value of "-1" disables temporary file information logging.
 If all temporary files aren't logged, it might be more difficult to identify potential performance issues that might be due to either poor application coding or deliberate resource starvation attempts.

**Severity**: Low

### [Ensure VM disks for critical VMs are encrypted with Customer-Supplied Encryption Key](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6ca40f30-2508-4c90-85b6-36564b909364)

**Description**: Customer-Supplied Encryption Keys (CSEK) are a feature in Google Cloud Storage and Google Compute Engine.
 If you supply your own encryption keys, Google uses your key to protect the Google-generated keys used to encrypt and decrypt your data.
 By default, Google Compute Engine encrypts all data at rest.
 Compute Engine handles and manages this encryption for you without any additional actions on your part.
 However, if you wanted to control and manage this encryption yourself, you can provide your own encryption keys.
By default, Google Compute Engine encrypts all data at rest. Compute Engine handles and manages this encryption for you without any additional actions on your part.
However, if you wanted to control and manage this encryption yourself, you can provide your own encryption keys.
If you provide your own encryption keys, Compute Engine uses your key to protect the Google-generated keys used to encrypt and decrypt your data.
Only users who can provide the correct key can use resources protected by a customer-supplied encryption key.
Google doesn't store your keys on its servers and can't access your protected data unless you provide the key.
This also means that if you forget or lose your key, there's no way for Google to recover the key or to recover any data encrypted with the lost key.
At least business critical VMs should have VM disks encrypted with CSEK.

**Severity**: Medium

### [GCP projects should have Azure Arc auto provisioning enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1716d754-8d50-4b90-87b6-0404cad9b4e3)

**Description**: For full visibility of the security content from Microsoft Defender for servers, GCP VM instances should be connected to Azure Arc. To ensure that all eligible VM instances automatically receive Azure Arc, enable autoprovisioning from Defender for Cloud at the GCP project level. Learn more about [Azure Arc](../azure-arc/servers/overview.md), and [Microsoft Defender for Servers](plan-defender-for-servers.md).

**Severity**: High

### [GCP VM instances should be connected to Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9bbe2f0f-d6c6-48e8-b4d0-cf25d2c50206)

**Description**: Connect your GCP Virtual Machines to Azure Arc in order to have full visibility to Microsoft Defender for Servers security content. Learn more about [Azure Arc](../azure-arc/index.yml), and about [Microsoft Defender for Servers](plan-defender-for-servers.md) on hybrid-cloud environment.

**Severity**: High

### [GCP VM instances should have OS config agent installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/20622d8c-2a4f-4a03-9896-a5f2f7ede717)

**Description**: To receive the full Defender for Servers capabilities using Azure Arc autoprovisioning, GCP VMs should have OS config agent enabled.

**Severity**: High

### [GKE cluster's auto repair feature should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6aeb69dc-0d01-4228-88e9-7e610891d5dd)

**Description**: This recommendation evaluates the management property of a node pool for the key-value pair, 'key': 'autoRepair,' 'value': true.

**Severity**: Medium

### [GKE cluster's auto upgrade feature should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1680e053-2e9b-4e77-a1c7-793ae286155e)

**Description**: This recommendation evaluates the management property of a node pool for the key-value pair, 'key': 'autoUpgrade,' 'value': true.

**Severity**: High

### [Monitoring on GKE clusters should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6a7b7361-5100-4a8c-b23e-f712d7dad39b)

**Description**: This recommendation evaluates whether the monitoringService property of a cluster contains the location Cloud Monitoring should use to write metrics.

**Severity**: Medium

## GCP Container recommendations

### [Advanced configuration of Defender for Containers should be enabled on GCP connectors](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b7683ca3-3a11-49b6-b9d4-a112713edfa3)

**Description**: Microsoft Defender for Containers provides cloud-native Kubernetes security capabilities including environment hardening, workload protection, and run-time protection. To ensure you the solution is provisioned properly, and the full set of capabilities are available, enable all advanced configuration settings.

**Severity**: High

### [GKE clusters should have Microsoft Defender's extension for Azure Arc installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0faf27b6-f1d5-4f50-b22a-5d129cba0113)

**Description**: Microsoft Defender's [cluster extension](../azure-arc/kubernetes/extensions.md) provides security capabilities for your GKE clusters. The extension collects data from a cluster and its nodes to identify security vulnerabilities and threats.
 The extension works with [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md).
Learn more about [Microsoft Defender for Cloud's security features for containerized environments](defender-for-containers-introduction.md?tabs=defender-for-container-arch-aks).

**Severity**: High

### [GKE clusters should have the Azure Policy extension installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6273e20b-8814-4fda-a297-42a70b16fcbf)

**Description**: Azure Policy extension for Kubernetes extends [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) v3, an admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/) (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.
 The extension works with [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md).

**Severity**: High

### [Microsoft Defender for Containers should be enabled on GCP connectors](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d42ac63d-0592-43b2-8bfa-ff9199da595e)

**Description**: Microsoft Defender for Containers provides cloud-native Kubernetes security capabilities including environment hardening, workload protection, and run-time protection. Enable Containers plan on your GCP connector, to harden the security of Kubernetes clusters and remediate security issues. Learn more about Microsoft Defender for Containers.

**Severity**: High

### [GKE cluster's auto repair feature should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6aeb69dc-0d01-4228-88e9-7e610891d5dd)

**Description**: This recommendation evaluates the management property of a node pool for the key-value pair, 'key': 'autoRepair,' 'value': true.

**Severity**: Medium

### [GKE cluster's auto upgrade feature should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1680e053-2e9b-4e77-a1c7-793ae286155e)

**Description**: This recommendation evaluates the management property of a node pool for the key-value pair, 'key': 'autoUpgrade,' 'value': true.

**Severity**: High

### [Monitoring on GKE clusters should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6a7b7361-5100-4a8c-b23e-f712d7dad39b)

**Description**: This recommendation evaluates whether the monitoringService property of a cluster contains the location Cloud Monitoring should use to write metrics.

**Severity**: Medium

### [Logging for GKE clusters should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fa160a2c-e976-41cb-acff-1e1e3f1ed032)

**Description**: This recommendation evaluates whether the loggingService property of a cluster contains the location Cloud Logging should use to write logs.

**Severity**: High

### [GKE web dashboard should be disabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d8fa5c03-a8e8-467b-992c-ad8b2db0f55e)

**Description**: This recommendation evaluates the kubernetesDashboard field of the addonsConfig property for the key-value pair, 'disabled': false.

**Severity**: High

### [Legacy Authorization should be disabled on GKE clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bd1096e1-73cf-41ab-8f2a-257b78aed9dc)

**Description**: This recommendation evaluates the legacyAbac property of a cluster for the key-value pair, 'enabled': true.

**Severity**: High

### [Control Plane Authorized Networks should be enabled on GKE clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/24df9ba4-8c98-42f2-9f64-50b095eca06f)

**Description**: This recommendation evaluates the masterAuthorizedNetworksConfig property of a cluster for the key-value pair, 'enabled': false.

**Severity**: High

### [GKE clusters should have alias IP ranges enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/49016ecd-d4d6-4f48-a64f-42af93e15120)

**Description**: This recommendation evaluates whether the useIPAliases field of the ipAllocationPolicy in a cluster is set to false.

**Severity**: Low

### [GKE clusters should have Private clusters enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d3e70cff-e4db-47b1-b646-0ac5ed8ada36)

**Description**: This recommendation evaluates whether the enablePrivateNodes field of the privateClusterConfig property is set to false.

**Severity**: High

### [Network policy should be enabled on GKE clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fd06513a-1e03-4d40-9159-243f76dcdcb7)

**Description**: This recommendation evaluates the networkPolicy field of the addonsConfig property for the key-value pair, 'disabled': true.

**Severity**: Medium

### Data plane recommendations

All the [Kubernetes data plane security recommendations](kubernetes-workload-protections.md#view-and-configure-the-bundle-of-recommendations) are supported for GCP after you [enable Azure Policy for Kubernetes](kubernetes-workload-protections.md#enable-kubernetes-data-plane-hardening).

## GCP Data recommendations

### [Ensure '3625 (trace flag)' database flag for Cloud SQL SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/631246fb-7192-4709-a0b3-b83e65e6b550)

**Description**: It's recommended to set "3625 (trace flag)" database flag for Cloud SQL SQL Server instance to "off."
 Trace flags are frequently used to diagnose performance issues or to debug stored procedures or complex computer systems, but they might also be recommended by Microsoft Support to address behavior that is negatively impacting a specific workload.
 All documented trace flags and those recommended by Microsoft Support are fully supported in a production environment when used as directed.
 "3625(trace log)" Limits the amount of information returned to users who aren't members of the sysadmin fixed server role, by masking the parameters of some error messages using '******.'
 This can help prevent disclosure of sensitive information. Hence this is recommended to disable this flag.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Medium

### [Ensure 'external scripts enabled' database flag for Cloud SQL SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/98b8908a-18b9-46ea-8c52-3f8db1da996f)

**Description**: It's recommended to set "external scripts enabled" database flag for Cloud SQL SQL Server instance to off.
 "external scripts enabled" enable the execution of scripts with certain remote language extensions.
 This property is OFF by default.
 When Advanced Analytics Services is installed, setup can optionally set this property to true.
 As the "External Scripts Enabled" feature allows scripts external to SQL such as files located in an R library to be executed, which could adversely affect the security of the system, hence this should be disabled.
 This recommendation is applicable to SQL Server database instances.

**Severity**: High

### [Ensure 'remote access' database flag for Cloud SQL SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dddbbe7d-7e32-47d8-b319-39cbb70b8f88)

**Description**: It's recommended to set "remote access" database flag for Cloud SQL SQL Server instance to "off."
 The "remote access" option controls the execution of stored procedures from local or remote servers on which instances of SQL Server are running.
 This default value for this option is 1.
 This grants permission to run local stored procedures from remote servers or remote stored procedures from the local server.
 To prevent local stored procedures from being run from a remote server or remote stored procedures from being run on the local server, this must be disabled.
 The Remote Access option controls the execution of local stored procedures on remote servers or remote stored procedures on local server.
 'Remote access' functionality can be abused to launch a Denial-of-Service (DoS) attack on remote servers by off-loading query processing to a target, hence this should be disabled.
 This recommendation is applicable to SQL Server database instances.

**Severity**: High

### [Ensure 'skip_show_database' database flag for Cloud SQL Mysql instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9e5b33de-bcfa-4044-93ce-4937bf8f0bbd)

**Description**: It's recommended to set "skip_show_database" database flag for Cloud SQL Mysql instance to "on."
 'skip_show_database' database flag prevents people from using the SHOW DATABASES statement if they don't have the SHOW DATABASES privilege.
 This can improve security if you have concerns about users being able to see databases belonging to other users.
 Its effect depends on the SHOW DATABASES privilege: If the variable value is ON, the SHOW DATABASES statement is permitted only to users who have the SHOW DATABASES privilege, and the statement displays all database names.
 If the value is OFF, SHOW DATABASES is permitted to all users, but displays the names of only those databases for which the user has the SHOW DATABASES or other privilege.
 This recommendation is applicable to Mysql database instances.

**Severity**: Low

### [Ensure that a Default Customer-managed encryption key (CMEK) is specified for all BigQuery Data Sets](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f024ea22-7e48-4b3b-a824-d61794c14bb4)

**Description**: BigQuery by default encrypts the data as rest by employing Envelope Encryption using Google managed cryptographic keys.
 The data is encrypted using the data encryption keys and data encryption keys themselves are further encrypted using key encryption keys.
This is seamless and does not require any additional input from the user.
However, if you want to have greater control, Customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery Data Sets.
BigQuery by default encrypts the data as rest by employing Envelope Encryption using Google managed cryptographic keys.
 This is seamless and doesn't require any additional input from the user.
For greater control over the encryption, customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery Data Sets.
 Setting a Default Customer-managed encryption key (CMEK) for a data set ensure any tables created in future will use the specified CMEK if none other is provided.
Note: Google doesn't store your keys on its servers and can't access your protected data unless you provide the key.
This also means that if you forget or lose your key, there's no way for Google to recover the key or to recover any data encrypted with the lost key.

**Severity**: Medium

### [Ensure that all BigQuery Tables are encrypted with Customer-managed encryption key (CMEK)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f4cfc689-cac8-4f45-8355-652dcda3ec55)

**Description**: BigQuery by default encrypts the data as rest by employing Envelope Encryption using Google managed cryptographic keys.
 The data is encrypted using the data encryption keys and data encryption keys themselves are further encrypted using key encryption keys.
 This is seamless and does not require any additional input from the user.
 However, if you want to have greater control, Customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery Data Sets.
 If CMEK is used, the CMEK is used to encrypt the data encryption keys instead of using google-managed encryption keys.
BigQuery by default encrypts the data as rest by employing Envelope Encryption using Google managed cryptographic keys.
This is seamless and doesn't require any additional input from the user.
For greater control over the encryption, customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery tables.
The CMEK is used to encrypt the data encryption keys instead of using google-managed encryption keys.
 BigQuery stores the table and CMEK association and the encryption/decryption is done automatically.
Applying the Default Customer-managed keys on BigQuery data sets ensures that all the new tables created in the future will be encrypted using CMEK but existing tables need to be updated to use CMEK individually.
Note: Google doesn't store your keys on its servers and can't access your protected data unless you provide the key.
 This also means that if you forget or lose your key, there's no way for Google to recover the key or to recover any data encrypted with the lost key.

**Severity**: Medium

### [Ensure that BigQuery datasets are not anonymously or publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dab1eea3-7693-4da3-af1b-2f73832655fa)

**Description**: It's recommended that the IAM policy on BigQuery datasets doesn't allow anonymous and/or public access.
  Granting permissions to allUsers or allAuthenticatedUsers allows anyone to access the dataset.
Such access might not be desirable if sensitive data is being stored in the dataset.
 Therefore, ensure that anonymous and/or public access to a dataset isn't allowed.

**Severity**: High

### [Ensure that Cloud SQL database instances are configured with automated backups](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/afaac6e6-6240-48a2-9f62-4e257b851311)

**Description**: It's recommended to have all SQL database instances set to enable automated backups.
 Backups provide a way to restore a Cloud SQL instance to recover lost data or recover from a problem with that instance.
 Automated backups need to be set for any instance that contains data that should be protected from loss or damage.
 This recommendation is applicable for SQL Server, PostgreSql, MySql generation 1, and MySql generation 2 instances.

**Severity**: High

### [Ensure that Cloud SQL database instances are not open to the world](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/de78ebca-1ec6-4872-8061-8fcfb27752fc)

**Description**: Database Server should accept connections only from trusted Network(s)/IP(s) and restrict access from the world.
 To minimize attack surface on a Database server instance, only trusted/known and required IP(s) should be approved to connect to it.
 An authorized network shouldn't have IPs/networks configured to "0.0.0.0/0", which will allow access to the instance from anywhere in the world. Note that authorized networks apply only to instances with public IPs.

**Severity**: High

### [Ensure that Cloud SQL database instances do not have public IPs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1658239d-caf7-471d-83c5-2e4c44afdcff)

**Description**: It's recommended to configure Second Generation Sql instance to use private IPs instead of public IPs.
 To lower the organization's attack surface, Cloud SQL databases shouldn't have public IPs.
 Private IPs provide improved network security and lower latency for your application.

**Severity**: High

### [Ensure that Cloud Storage bucket is not anonymously or publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d8305d96-2aa5-458d-92b7-f8418f5f3328)

**Description**: It's recommended that IAM policy on Cloud Storage bucket doesn't allows anonymous or public access.
Allowing anonymous or public access grants permissions to anyone to access bucket content.
 Such access might not be desired if you're storing any sensitive data.
 Hence, ensure that anonymous or public access to a bucket isn't allowed.

**Severity**: High

### [Ensure that Cloud Storage buckets have uniform bucket-level access enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/64b5cdbc-0633-49af-b63d-a9dc90560196)

**Description**: It's recommended that uniform bucket-level access is enabled on Cloud Storage buckets.
 It's recommended to use uniform bucket-level access to unify and simplify how you grant access to your Cloud Storage resources.
 Cloud Storage offers two systems for granting users permission to access your buckets and objects:
 Cloud Identity and Access Management (Cloud IAM) and Access Control Lists (ACLs).  
 These systems act in parallel - in order for a user to access a Cloud Storage resource, only one of the systems needs to grant the user permission.
 Cloud IAM is used throughout Google Cloud and allows you to grant a variety of permissions at the bucket and project levels.
 ACLs are used only by Cloud Storage and have limited permission options, but they allow you to grant permissions on a per-object basis.

 In order to support a uniform permissioning system, Cloud Storage has uniform bucket-level access.
 Using this feature disables ACLs for all Cloud Storage resources:
 access to Cloud Storage resources then is granted exclusively through Cloud IAM.
 Enabling uniform bucket-level access guarantees that if a Storage bucket isn't publicly accessible,
no object in the bucket is publicly accessible either.

**Severity**: Medium

### [Ensure that Compute instances have Confidential Computing enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/171e9492-73a7-43de-adce-6bd0a3cf6045)

**Description**: Google Cloud encrypts data at-rest and in-transit, but customer data must be decrypted for processing. Confidential Computing is a breakthrough technology that encrypts data in-use-while it's being processed.
 Confidential Computing environments keep data encrypted in memory and elsewhere outside the central processing unit (CPU).
Confidential VMs leverage the Secure Encrypted Virtualization (SEV) feature of AMD EPYC CPUs.
 Customer data will stay encrypted while it's used, indexed, queried, or trained on.
 Encryption keys are generated in hardware, per VM, and not exportable. Thanks to built-in hardware optimizations of both performance and security, there's no significant performance penalty to Confidential Computing workloads.
Confidential Computing enables customers' sensitive code and other data encrypted in memory during processing. Google doesn't have access to the encryption keys.
Confidential VM can help alleviate concerns about risk related to either dependency on Google infrastructure or Google insiders' access to customer data in the clear.

**Severity**: High

### [Ensure that retention policies on log buckets are configured using Bucket Lock](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/07ca1398-d477-400a-a9fc-4cfc78f723f9)

**Description**: Enabling retention policies on log buckets will protect logs stored in cloud storage buckets from being overwritten or accidentally deleted.
 It's recommended to set up retention policies and configure Bucket Lock on all storage buckets that are used as log sinks.
 Logs can be exported by creating one or more sinks that include a log filter and a destination. As Stackdriver Logging receives new log entries, they're compared against each sink.
 If a log entry matches a sink's filter, then a copy of the log entry is written to the destination.
 Sinks can be configured to export logs in storage buckets.
 It's recommended to configure a data retention policy for these cloud storage buckets and to lock the data retention policy; thus permanently preventing the policy from being reduced or removed.
 This way, if the system is ever compromised by an attacker or a malicious insider who wants to cover their tracks, the activity logs are definitely preserved for forensics and security investigations.

**Severity**: Low

### [Ensure that the Cloud SQL database instance requires all incoming connections to use SSL](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/13872d43-aac6-4018-9c89-507b8fe9be54)

**Description**: It's recommended to enforce all incoming connections to SQL database instance to use SSL.
 SQL database connections if successfully trapped (MITM); can reveal sensitive data like credentials, database queries, query outputs etc.
 For security, it's recommended to always use SSL encryption when connecting to your instance.
 This recommendation is applicable for Postgresql, MySql generation 1, and MySql generation 2 instances.

**Severity**: High

### [Ensure that the 'contained database authentication' database flag for Cloud SQL on the SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/658ce98f-ecf1-4c14-967f-3c4faf130fbf)

**Description**: It's recommended to set "contained database authentication" database flag for Cloud SQL on the SQL Server instance is set to "off."
 A contained database includes all database settings and metadata required to define the database and has no configuration dependencies on the instance of the Database Engine where the database is installed.
 Users can connect to the database without authenticating a login at the Database Engine level.
 Isolating the database from the Database Engine makes it possible to easily move the database to another instance of SQL Server.
 Contained databases have some unique threats that should be understood and mitigated by SQL Server Database Engine administrators.
 Most of the threats are related to the USER WITH PASSWORD authentication process, which moves the authentication boundary from the Database Engine level to the database level, hence this is recommended to disable this flag.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Medium

### [Ensure that the 'cross db ownership chaining' database flag for Cloud SQL SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/26973a34-79a6-46a0-874f-358c8c00af05)

**Description**: It's recommended to set "cross db ownership chaining" database flag for Cloud SQL SQL Server instance to "off."
 Use the "cross db ownership" for chaining option to configure cross-database ownership chaining for an instance of Microsoft SQL Server.
 This server option allows you to control cross-database ownership chaining at the database level or to allow cross-database ownership chaining for all databases.
 Enabling "cross db ownership" isn't recommended unless all of the databases hosted by the instance of SQL Server must participate in cross-database ownership chaining and you're aware of the security implications of this setting.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Medium

### [Ensure that the 'local_infile' database flag for a Cloud SQL Mysql instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/633a87f4-bd71-45ce-9eca-c6bb8cbe8b21)

**Description**: It's recommended to set the local_infile database flag for a Cloud SQL MySQL instance to off.
The local_infile flag controls the server-side LOCAL capability for LOAD DATA statements. Depending on the local_infile setting, the server refuses or permits local data loading by clients that have LOCAL enabled on the client side.
To explicitly cause the server to refuse LOAD DATA LOCAL statements (regardless of how client programs and libraries are configured at build time or runtime), start mysqld with local_infile disabled. local_infile can also be set at runtime.
Due to security issues associated with the local_infile flag, it's recommended to disable it. This recommendation is applicable to MySQL database instances.

**Severity**: Medium

### [Ensure that the log metric filter and alerts exist for Cloud Storage IAM permission changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2e14266c-76ea-4479-915e-4edaae7d78ec)

**Description**: It's recommended that a metric filter and alarm be established for Cloud Storage Bucket IAM changes.
Monitoring changes to cloud storage bucket permissions might reduce the time needed to detect and correct permissions on sensitive cloud storage buckets and objects inside the bucket.

**Severity**: Low

### [Ensure that the log metric filter and alerts exist for SQL instance configuration changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9dce022e-f7f9-4725-8a63-c0d4a868b4d3)

**Description**: It's recommended that a metric filter and alarm be established for SQL instance configuration changes.
Monitoring changes to SQL instance configuration changes might reduce the time needed to detect and correct misconfigurations done on the SQL server.
Below are a few of the configurable options that might impact the security posture of an SQL instance:

- Enable auto backups and high availability: Misconfiguration might adversely impact business continuity, disaster recovery, and high availability
- Authorize networks: Misconfiguration might increase exposure to untrusted networks

**Severity**: Low

### [Ensure that there are only GCP-managed service account keys for each service account](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6991b2e9-ae9e-4e99-acb6-037c4b575215)

**Description**: User managed service accounts shouldn't have user-managed keys.
 Anyone who has access to the keys will be able to access resources through the service account. GCP-managed keys are used by Cloud Platform services such as App Engine and Compute Engine. These keys can't be downloaded. Google will keep the keys and automatically rotate them on an approximately weekly basis.
 User-managed keys are created, downloadable, and managed by users. They expire 10 years from creation.
For user-managed keys, the user has to take ownership of key management activities, which include:

- Key storage
- Key distribution
- Key revocation
- Key rotation
- Protecting the keys from unauthorized users
- Key recovery

Even with key owner precautions, keys can be easily leaked by common development malpractices like checking keys into the source code or leaving them in the Downloads directory, or accidentally leaving them on support blogs/channels. It's recommended to prevent user-managed service account keys.

**Severity**: Low

### [Ensure 'user connections' database flag for Cloud SQL SQL Server instance is set as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/91f55b07-083c-4ec5-a2be-4b52bbc2e2df)

**Description**: It's recommended to set "user connections" database flag for Cloud SQL SQL Server instance according to organization-defined value.
 The "user connections" option specifies the maximum number of simultaneous user connections that are allowed on an instance of SQL Server.
 The actual number of user connections allowed also depends on the version of SQL Server that you're using, and also the limits of your application or applications and hardware.
 SQL Server allows a maximum of 32,767 user connections.
 Because user connections is a dynamic (self-configuring) option, SQL Server adjusts the maximum number of user connections automatically as needed, up to the maximum value allowable.
 For example, if only 10 users are logged in, 10 user connection objects are allocated.
 In most cases, you don't have to change the value for this option.
 The default is 0, which means that the maximum (32,767) user connections are allowed.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Low

### [Ensure 'user options' database flag for Cloud SQL SQL Server instance is not configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fab1e680-86f0-4616-bee9-1b7394e49ade)

**Description**: It's recommended that, "user options" database flag for Cloud SQL SQL Server instance shouldn't be configured.
 The "user options" option specifies global defaults for all users.
 A list of default query processing options is established for the duration of a user's work session.
 The user options option allows you to change the default values of the SET options (if the server's default settings aren't appropriate).
 A user can override these defaults by using the SET statement.
 You can configure user options dynamically for new logins.
 After you change the setting of user options, new login sessions use the new setting; current login sessions aren't affected.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Low

### [Logging for GKE clusters should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fa160a2c-e976-41cb-acff-1e1e3f1ed032)

**Description**: This recommendation evaluates whether the loggingService property of a cluster contains the location Cloud Logging should use to write logs.

**Severity**: High

### [Object versioning should be enabled on storage buckets where sinks are configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e836b239-c7dc-476a-9a85-829b565cbc59)

**Description**: This recommendation evaluates whether the enabled field in the bucket's versioning property is set to true.

**Severity**: High

### [Over-provisioned identities in projects should be investigated to reduce the Permission Creep Index (PCI)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a6cd9b98-3b29-4213-b880-43f0b0897b83)

**Description**: Over-provisioned identities in projects should be investigated to reduce the Permission Creep Index (PCI) and to safeguard your infrastructure. Reduce the PCI by removing the unused high risk permission assignments. High PCI reflects risk associated with the identities with permissions that exceed their normal or required usage.

**Severity**: Medium

### [Projects that have cryptographic keys should not have users with Owner permissions](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/986fe72e-466a-462d-a06e-c77b439c53c0)

**Description**: This recommendation evaluates the IAM allow policy in project metadata for principals assigned roles/Owner.

**Severity**: Medium

### [Storage buckets used as a log sink should not be publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/76261631-76ea-4bd4-b064-34a619be1de0)

**Description**: This recommendation evaluates the IAM policy of a bucket for the principals allUsers or allAuthenticatedUsers, which grant public access.

**Severity**: High

## GCP IdentityAndAccess recommendations

### [Cryptographic keys should not have more than three users](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/24eb0365-d63d-43c0-b11f-8b0a1a0842f7)

**Description**: This recommendation evaluates IAM policies for key rings, projects, and organizations, and retrieves principals with roles that allow them to encrypt, decrypt, or sign data using Cloud KMS keys: roles/owner, roles/cloudkms.cryptoKeyEncrypterDecrypter, roles/cloudkms.cryptoKeyEncrypter, roles/cloudkms.cryptoKeyDecrypter, roles/cloudkms.signer, and roles/cloudkms.signerVerifier.

**Severity**: Medium

### [Ensure API keys are not created for a project](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/29ed3416-2035-4d44-986e-0bcbb7de172e)

**Description**: Keys are insecure because they can be viewed publicly, such as from within a browser, or they can be accessed on a device where the key resides. It's recommended to use standard authentication flow instead.

 Security risks involved in using API-Keys appear below:

 1. API keys are simple encrypted strings
 2. API keys don't identify the user or the application making the API request
 3. API keys are typically accessible to clients, making it easy to discover and steal an API key

 To avoid the security risk in using API keys, it's recommended to use standard authentication flow instead.

**Severity**: High

### [Ensure API keys are restricted to only APIs that application needs access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/54d3b0ae-67b3-4fee-9ac4-f6c784b9d16b)

**Description**: API keys are insecure because they can be viewed publicly, such as from within a browser, or they can be accessed on a device where the key resides. It's recommended to restrict API keys to use (call) only APIs required by an application.

 Security risks involved in using API-Keys are below:

 1. API keys are simple encrypted strings
 2. API keys don't identify the user or the application making the API request
 3. API keys are typically accessible to clients, making it easy to discover and steal an API key

In light of these potential risks, Google recommends using the standard authentication flow instead of API-Keys. However, there are limited cases where API keys are more appropriate. For example, if there's a mobile application that needs to use the Google Cloud Translation API, but doesn't otherwise need a backend server, API keys are the simplest way to authenticate to that API.

 In order to reduce attack surfaces by providing least privileges, API-Keys can be restricted to use (call) only APIs required by an application.

**Severity**: High

### [Ensure API keys are restricted to use by only specified Hosts and Apps](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/63e0e2db-70c3-4edc-becf-93961d3156ed)

**Description**: Unrestricted keys are insecure because they can be viewed publicly, such as from within a browser, or they can be accessed on a device where the key resides. It's recommended to restrict API key usage to trusted hosts, HTTP referrers, and apps.

 Security risks involved in using API-Keys appear below:

 1. API keys are simple encrypted strings
 2. API keys don't identify the user or the application making the API request
 3. API keys are typically accessible to clients, making it easy to discover and steal an API key

In light of these potential risks, Google recommends using the standard authentication flow instead of API keys. However, there are limited cases where API keys are more appropriate.
For example, if there's a mobile application that needs to use the Google Cloud Translation API, but doesn't otherwise need a backend server, API keys are the simplest way to authenticate to that API.

 In order to reduce attack vectors, API-Keys can be restricted only to trusted hosts, HTTP referrers, and applications.

**Severity**: High

### [Ensure API keys are rotated every 90 days](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fbc1ef5d-989e-4b64-8e9d-221b422f9c43)

**Description**: It's recommended to rotate API keys every 90 days.

 Security risks involved in using API-Keys are listed below:

 1. API keys are simple encrypted strings
 2. API keys don't identify the user or the application making the API request
 3. API keys are typically accessible to clients, making it easy to discover and steal an API key

Because of these potential risks, Google recommends using the standard authentication flow instead of API Keys. However, there are limited cases where API keys are more appropriate. For example, if there's a mobile application that needs to use the Google Cloud Translation API, but doesn't otherwise need a backend server, API keys are the simplest way to authenticate to that API.

 Once a key is stolen, it has no expiration, meaning it might be used indefinitely unless the project owner revokes or regenerates the key. Rotating API keys will reduce the window of opportunity for an access key that is associated with a compromised or terminated account to be used.

 API keys should be rotated to ensure that data can't be accessed with an old key that might have been lost, cracked, or stolen.

**Severity**: High

### [Ensure KMS encryption keys are rotated within a period of 90 days](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f756937d-b790-4718-8dd7-fa995930c4a1)

**Description**: Google Cloud Key Management Service stores cryptographic keys in a hierarchical structure designed for useful and elegant access control management.
 The format for the rotation schedule depends on the client library that is used.
 For the gcloud command-line tool, the next rotation time must be in "ISO" or "RFC3339" format, and the rotation period must be in the form "INTEGER[UNIT]," where units can be one of seconds (s), minutes (m), hours (h), or days (d).
 Set a key rotation period and starting time. A key can be created with a specified "rotation period," which is the time between when new key versions are generated automatically.
 A key can also be created with a specified next rotation time.
 A key is a named object representing a "cryptographic key" used for a specific purpose.
 The key material, the actual bits used for "encryption," can change over time as new key versions are created.
 A key is used to protect some "corpus of data." A collection of files could be encrypted with the same key and people with "decrypt" permissions on that key would be able to decrypt those files.
 Therefore, it's necessary to make sure the "rotation period" is set to a specific time.

**Severity**: Medium

### [Ensure log metric filter and alerts exist for project ownership assignments/changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f42c20a6-8012-4e1e-bf4d-19b977e8c8d7)

**Description**: In order to prevent unnecessary project ownership assignments to users/service-accounts and further misuses of projects and resources, all "roles/Owner" assignments should be monitored.
 Members (users/Service-Accounts) with a role assignment to primitive role "roles/Owner" are project owners.
 The project owner has all the privileges on the project the role belongs to. These are summarized below:

- All viewer permissions on all GCP Services within the project
- Permissions for actions that modify the state of all GCP services within the project
- Manage roles and permissions for a project and all resources within the project
- Set up billing for a project
 Granting the owner role to a member (user/Service-Account) will allow that member to modify the Identity and Access Management (IAM) policy. Therefore, grant the owner role only if the member has a legitimate purpose to manage the IAM policy. This is because the project IAM policy contains sensitive access control data. Having a minimal set of users allowed to manage IAM policy will simplify any auditing that might be necessary.
Project ownership has the highest level of privileges on a project. To avoid misuse of project resources, the project ownership assignment/change actions mentioned above should be monitored and alerted to concerned recipients.
- Sending project ownership invites
- Acceptance/Rejection of project ownership invite by user
- Adding `role\Owner` to a user/service-account
- Removing a user/Service account from `role\Owner`

**Severity**: Low

### [Ensure oslogin is enabled for a Project](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/49cb12f0-3dd3-4220-9cfb-5c3fd514a6d8)

**Description**: Enabling OS login binds SSH certificates to IAM users and facilitates effective SSH certificate management.
Enabling osLogin ensures that SSH keys used to connect to instances are mapped with IAM users. Revoking access to IAM user will revoke all the SSH keys associated with that particular user.
It facilitates centralized and automated SSH key pair management, which is useful in handling cases like response to compromised SSH key pairs and/or revocation of external/third-party/Vendor users.
To find out which instance causes the project to be unhealthy see recommendation "Ensure oslogin is enabled for all instances."

**Severity**: Medium

### [Ensure oslogin is enabled for all instances](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/569ef64e-d7aa-4d7e-aa0b-5b3e045ca2c3)

**Description**: Enabling OS login binds SSH certificates to IAM users and facilitates effective SSH certificate management.
Enabling osLogin ensures that SSH keys used to connect to instances are mapped with IAM users. Revoking access to IAM user will revoke all the SSH keys associated with that particular user.
It facilitates centralized and automated SSH key pair management, which is useful in handling cases like response to compromised SSH key pairs and/or revocation of external/third-party/Vendor users.

**Severity**: Medium

### [Ensure that Cloud Audit Logging is configured properly across all services and all users from a project](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0b9173aa-68d9-4581-814f-fab4a91aa9af)

**Description**: It's recommended that Cloud Audit Logging is configured to track all admin activities and read, write access to user data.

Cloud Audit Logging maintains two audit logs for each project, folder, and organization: Admin Activity and Data Access.

1. Admin Activity logs contain log entries for API calls or other administrative actions that modify the configuration or metadata of resources.
 Admin Activity audit logs are enabled for all services and can't be configured.
1. Data Access audit logs record API calls that create, modify, or read user-provided data. These are disabled by default and should be enabled.
There are three kinds of Data Access audit log information:

- Admin read: Records operations that read metadata or configuration information. Admin Activity audit logs record writes of metadata and configuration information that can't be disabled.
- Data read: Records operations that read user-provided data.
- Data write: Records operations that write user-provided data.

 It's recommended to have an effective default audit config configured in such a way that:

 1. logtype is set to DATA_READ (to log user activity tracking) and DATA_WRITES (to log changes/tampering to user data).
 1. audit config is enabled for all the services supported by the Data Access audit logs feature.
 1. Logs should be captured for all users, that is, there are no exempted users in any of the audit config sections. This will ensure overriding the audit config will not contradict the requirement.

**Severity**: Medium

### [Ensure that Cloud KMS cryptokeys are not anonymously or publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fcbcaef9-4bb0-49db-a932-afd64ed221d4)

**Description**: It's recommended that the IAM policy on Cloud KMS "cryptokeys" should restrict anonymous and/or public access.
 Granting permissions to "allUsers" or "allAuthenticatedUsers" allows anyone to access the dataset.
 Such access might not be desirable if sensitive data is stored at the location.
 In this case, ensure that anonymous and/or public access to a Cloud KMS "cryptokey" isn't allowed.

**Severity**: High

### [Ensure that corporate login credentials are used](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/67ebdf6b-6197-4e42-bbbf-eaf4e6c20b4c)

**Description**: Use corporate login credentials instead of personal accounts, such as Gmail accounts.
 It's recommended fully managed corporate Google accounts be used for increased visibility, auditing, and controlling access to Cloud Platform resources.
 Gmail accounts based outside of the user's organization, such as personal accounts, shouldn't be used for business purposes.

**Severity**: High

### [Ensure that IAM users are not assigned the Service Account User or Service Account Token Creator roles at project level](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/54c381fe-a80a-4038-8a9d-c166d2922ea9)

**Description**: It's recommended to assign the "Service Account User (iam.serviceAccountUser)" and "Service Account Token Creator (iam.serviceAccountTokenCreator)" roles to a user for a specific service account rather than assigning the role to a user at project level.
 A service account is a special Google account that belongs to an application or a virtual machine (VM), instead of to an individual end-user.
 Application/VM-Instance uses the service account to call the service's Google API so that users aren't directly involved.
 In addition to being an identity, a service account is a resource that has IAM policies attached to it. These policies determine who can use the service account.
 Users with IAM roles to update the App Engine and Compute Engine instances (such as App Engine Deployer or Compute Instance Admin) can effectively run code as the service accounts used to run these instances, and indirectly gain access to all the resources for which the service accounts have access.
 Similarly, SSH access to a Compute Engine instance might also provide the ability to execute code as that instance/Service account.
 Based on business needs, there could be multiple user-managed service accounts configured for a project.
 Granting the "iam.serviceAccountUser" or "iam.serviceAserviceAccountTokenCreatorccountUser" roles to a user for a project gives the user access to all service accounts in the project, including service accounts that might be created in the future.
 This can result in elevation of privileges by using service accounts and corresponding "Compute Engine instances."
 In order to implement "least privileges" best practices, IAM users shouldn't be assigned the "Service Account User" or "Service Account Token Creator" roles at the project level. Instead, these roles should be assigned to a user for a specific service account, giving that user access to the service account. The "Service Account User" allows a user to bind a service account to a long-running job service, whereas the "Service Account Token Creator" role allows a user to directly impersonate (or assert) the identity of a service account.

**Severity**: Medium

### [Ensure that Separation of duties is enforced while assigning KMS related roles to users](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/14007242-eadd-4d15-ad54-97201351c0ec)

**Description**: It's recommended that the principle of 'Separation of Duties' is enforced while assigning KMS related roles to users.
 The built-in/predefined IAM role "Cloud KMS Admin" allows the user/identity to create, delete, and manage service account(s).
 The built-in/predefined IAM role "Cloud KMS CryptoKey Encrypter/Decrypter" allows the user/identity (with adequate privileges on concerned resources) to encrypt and decrypt data at rest using an encryption key(s).
 The built-in/predefined IAM role Cloud KMS CryptoKey Encrypter allows the user/identity (with adequate privileges on concerned resources) to encrypt data at rest using an encryption key(s).
 The built-in/predefined IAM role "Cloud KMS CryptoKey Decrypter" allows the user/identity (with adequate privileges on concerned resources) to decrypt data at rest using an encryption key(s).
 Separation of duties is the concept of ensuring that one individual doesn't have all necessary permissions to be able to complete a malicious action.
 In Cloud KMS, this could be an action such as using a key to access and decrypt data a user shouldn't normally have access to.
 Separation of duties is a business control typically used in larger organizations, meant to help avoid security or privacy incidents and errors.
 It's considered best practice. No user(s) should have Cloud KMS Admin and any of the "Cloud KMS CryptoKey Encrypter/Decrypter," "Cloud KMS CryptoKey Encrypter," "Cloud KMS CryptoKey Decrypter" roles assigned at the same time.

**Severity**: High

### [Ensure that Separation of duties is enforced while assigning service account related roles to users](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9e8cb9ac-87ee-424b-a9d2-0d41e411d18f)

**Description**: It's recommended that the principle of 'Separation of Duties' is enforced while assigning service-account related roles to users.
 The built-in/predefined IAM role "Service Account admin" allows the user/identity to create, delete, and manage service account(s).
 The built-in/predefined IAM role "Service Account User" allows the user/identity (with adequate privileges on Compute and App Engine) to assign service account(s) to Apps/Compute Instances.
 Separation of duties is the concept of ensuring that one individual doesn't have all necessary permissions to be able to complete a malicious action.
 In Cloud IAM - service accounts, this could be an action such as using a service account to access resources that user shouldn't normally have access to.
 Separation of duties is a business control typically used in larger organizations, meant to help avoid security or privacy incidents and errors. It's considered best practice.
 No user should have "Service Account Admin" and "Service Account User" roles assigned at the same time.

**Severity**: Medium

### [Ensure that Service Account has no Admin privileges](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ae77cb8b-0b43-4e86-8b5c-f5afcf95766a)

**Description**: A service account is a special Google account that belongs to an application or a VM, instead of to an individual end-user.
 The application uses the service account to call the service's Google API so that users aren't directly involved.
 It's recommended not to use admin access for ServiceAccount.
 Service accounts represent service-level security of the Resources (application or a VM) which can be determined by the roles assigned to it.
 Enrolling ServiceAccount with Admin rights gives full access to an assigned application or a VM.
 A ServiceAccount Access holder can perform critical actions like delete, update change settings, etc.
 without user intervention.
 For this reason, it's recommended that service accounts not have Admin rights.

**Severity**: Medium

### [Ensure that sinks are configured for all log entries](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/194b473e-7c5a-4754-b1ae-76591fe11b5c)

**Description**: It's recommended to create a sink that will export copies of all the log entries. This can help aggregate logs from multiple projects and export them to a Security Information and Event Management (SIEM).
 Log entries are held in Stackdriver Logging. To aggregate logs, export them to a SIEM. To keep them longer, it's recommended to set up a log sink. Exporting involves writing a filter that selects the log entries to export, and choosing a destination in Cloud Storage, BigQuery, or Cloud Pub/Sub.
 The filter and destination are held in an object called a sink. To ensure all log entries are exported to sinks, ensure that there's no filter configured for a sink. Sinks can be created in projects, organizations, folders, and billing accounts.

**Severity**: Low

### [Ensure that the log metric filter and alerts exist for Audit Configuration changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/34ed4dfb-fc6d-498f-b2b0-d1099704775d)

**Description**: Google Cloud Platform (GCP) services write audit log entries to the Admin Activity and Data Access logs to help answer the questions of, "who did what, where, and when?" within GCP projects.
Cloud audit logging records information includes the identity of the API caller, the time of the API call, the source IP address of the API caller, the request parameters, and the response elements returned by GCP services. Cloud audit logging provides a history of GCP API calls for an account, including API calls made via the console, SDKs, command-line tools, and other GCP services.
Admin activity and data access logs produced by cloud audit logging enable security analysis, resource change tracking, and compliance auditing.
Configuring the metric filter and alerts for audit configuration changes ensures the recommended state of audit configuration is maintained so that all activities in the project are audit-able at any point in time.

**Severity**: Low

### [Ensure that the log metric filter and alerts exist for Custom Role changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ba27e90d-311d-409d-8c69-7dfac0a1351c)

**Description**: It's recommended that a metric filter and alarm be established for changes to Identity and Access Management (IAM) role creation, deletion, and updating activities.
Google Cloud IAM provides predefined roles that give granular access to specific Google Cloud Platform resources and prevent unwanted access to other resources. However, to cater to organization-specific needs, Cloud IAM also provides the ability to create custom roles. Project owners and administrators with the Organization Role Administrator role or the IAM Role Administrator role can create custom roles. Monitoring role creation, deletion and updating activities will help in identifying any over-privileged role at early stages.

**Severity**: Low

### [Ensure user-managed/external keys for service accounts are rotated every 90 days or less](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0007dd31-9e95-460d-82bd-ae3e9e623161)

**Description**: Service Account keys consist of a key ID (Private_key_Id) and Private key, which are used to sign programmatic requests users make to Google cloud services accessible to that particular service account.
 It's recommended that all Service Account keys are regularly rotated.
 Rotating Service Account keys will reduce the window of opportunity for an access key that is associated with a compromised or terminated account to be used. Service Account keys should be rotated to ensure that data can't be accessed with an old key that might have been lost, cracked, or stolen.
 Each service account is associated with a key pair managed by Google Cloud Platform (GCP). It's used for service-to-service authentication within GCP. Google rotates the keys daily.
 GCP provides the option to create one or more user-managed (also called external key pairs) key pairs for use from outside GCP (for example, for use with Application Default Credentials). When a new key pair is created, the user is required to download the private key (which isn't retained by Google).

With external keys, users are responsible for keeping the private key secure and other management operations such as key rotation. External keys can be managed by the IAM API, gcloud command-line tool, or the Service Accounts page in the Google Cloud Platform Console.

GCP facilitates up to 10 external service account keys per service account to facilitate key rotation.

**Severity**: Medium

### [GKE web dashboard should be disabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d8fa5c03-a8e8-467b-992c-ad8b2db0f55e)

**Description**: This recommendation evaluates the kubernetesDashboard field of the addonsConfig property for the key-value pair, 'disabled': false.

**Severity**: High

### [Legacy Authorization should be disabled on GKE clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bd1096e1-73cf-41ab-8f2a-257b78aed9dc)

**Description**: This recommendation evaluates the legacyAbac property of a cluster for the key-value pair, 'enabled': true.

**Severity**: High

### [Redis IAM role should not be assigned at the organization or folder level](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7c20b7aa-be3d-4a4b-af45-1b432c02f86b)

**Description**: This recommendation evaluates the IAM allow policy in resource metadata for principals assigned roles/redis.admin, roles/redis.editor, roles/redis.viewer at the organization or folder level.

**Severity**: High

### [Service accounts should have restricted project access in a cluster](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b73bad4f-4ea7-4d04-bab0-d400cb3ad639)

**Description**: This recommendation evaluates the config property of a node pool to check if no service account is specified or if the default service account is used.

**Severity**: High

### [Users should have least privilege access with granular IAM roles](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4a7771a9-a2dd-40e8-87a2-921259d68667)

**Description**: This recommendation evaluates the IAM policy in resource metadata for any principals assigned roles/Owner, roles/Writer, or roles/Reader.

**Severity**: High

### [Super Identities in your GCP environment should be removed (Preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/7057d0ba-7d1c-4484-8bae-e82785cf8418)

**Description**: A super identity has a powerful set of permissions. Super admins are human or workload identities that have access to all permissions and all resources. They can create and modify configuration settings to a service, add or remove identities, and access or even delete data. Left unmonitored, these identities present a significant risk of permission misuse if breached.

**Severity**: High

### [Unused identities in your GCP environment should be removed (Preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/257e9506-fd47-4123-a8ef-92017f845906)

**Description**: It's imperative to identify unused identities as they pose significant security risks. These identities often involve bad practices, such as excessive permissions and mismanaged keys that leave organizations open to credential misuse or exploitation and increases your resource`s attack surface. Inactive identities are human and nonhuman entities that haven't performed any action on any resource in the last 90 days. Service account keys can become a security risk if not managed carefully.

**Severity**: Medium

### [GCP overprovisioned identities should have only the necessary permissions (Preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/fa210cff-18da-474a-ac60-8f93f7c6f4c9)

**Description**: An over-provisioned active identity is an identity that has access to privileges that they haven't used. Over-provisioned active identities, especially for nonhuman accounts that have very defined actions and responsibilities, can increase the blast radius in the event of a user, key, or resource compromise The principle of least privilege states that a resource should only have access to the exact resources it needs in order to function. This principle was developed to address the risk of compromised identities granting an attacker access to a wide range of resources.

**Severity**: Medium

## GCP Networking recommendations

### [Cluster hosts should be configured to use only private, internal IP addresses to access Google APIs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fae39f34-d931-4026-b09c-b0a785bb1ff9)

**Description**: This recommendation evaluates whether the privateIpGoogleAccess property of a subnetwork is set to false.

**Severity**: High

### [Compute instances should use a load balancer that is configured to use a target HTTPS proxy](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c3be77f6-6fa9-45bd-9bdb-420484420235)

**Description**: This recommendation evaluates if the selfLink property of the targetHttpProxy resource matches the target attribute in the forwarding rule, and if the forwarding rule contains a loadBalancingScheme field set to External.

**Severity**: Medium

### [Control Plane Authorized Networks should be enabled on GKE clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/24df9ba4-8c98-42f2-9f64-50b095eca06f)

**Description**: This recommendation evaluates the masterAuthorizedNetworksConfig property of a cluster for the key-value pair, 'enabled': false.

**Severity**: High

### [Egress deny rule should be set on a firewall to block unwanted outbound traffic](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2acc6ce9-c9a7-4d91-b7c8-f2314ecbf8af)

**Description**: This recommendation evaluates whether the destinationRanges property in the firewall is set to 0.0.0.0/0 and the denied property contains the key-value pair, 'IPProtocol': 'all.'

**Severity**: Low

### [Ensure Firewall Rules for instances behind Identity Aware Proxy (IAP) only allow the traffic from Google Cloud Loadbalancer (GCLB) Health Check and Proxy Addresses](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/814c3346-91c9-4e70-90b6-985cfd3e0478)

**Description**: Access to VMs should be restricted by firewall rules that allow only IAP traffic by ensuring only connections proxied by the IAP are allowed.
To ensure that load balancing works correctly health checks should also be allowed.
IAP ensure that access to VMs is controlled by authenticating incoming requests.
 However if the VM is still accessible from IP addresses other than the IAP it might still be possible to send unauthenticated requests to the instance.
 Care must be taken to ensure that loadblancer health checks aren't blocked as this would stop the load balancer from correctly knowing the health of the VM and load balancing correctly.

**Severity**: Medium

### [Ensure legacy networks do not exist for a project](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/44995f9b-5963-4a92-8e99-6d68acbc187c)

**Description**: In order to prevent use of legacy networks, a project shouldn't have a legacy network configured.
 Legacy networks have a single network IPv4 prefix range and a single gateway IP address for the whole network. The network is global in scope and spans all cloud regions.
 Subnetworks can't be created in a legacy network and are unable to switch from legacy to auto or custom subnet networks. Legacy networks can have an impact for high network traffic projects and are subject to a single point of contention or failure.

**Severity**: Medium

### [Ensure 'log_hostname' database flag for Cloud SQL PostgreSQL instance is set appropriately](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/989db7d6-71d5-4928-a9a6-c9ab7b8044e9)

**Description**: PostgreSQL logs only the IP address of the connecting hosts.
 The "log_hostname" flag controls the logging of "hostnames" in addition to the IP addresses logged.
 The performance hit is dependent on the configuration of the environment and the host name resolution setup.
 This parameter can only be set in the "postgresql.conf" file or on the server command line.
 Logging hostnames can incur overhead on server performance as for each statement logged, DNS resolution will be required to convert IP address to hostname.
 Depending on the setup, this might be non-negligible.
 Additionally, the IP addresses that are logged can be resolved to their DNS names later when reviewing the logs excluding the cases where dynamic hostnames are used.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure no HTTPS or SSL proxy load balancers permit SSL policies with weak cipher suites](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/58c07fca-9c6e-46fa-84a7-642f224a1d18)

**Description**: Secure Sockets Layer (SSL) policies determine what port Transport Layer Security (TLS) features clients are permitted to use when connecting to load balancers.
To prevent usage of insecure features, SSL policies should use (a) at least TLS 1.2 with the MODERN profile;
 or (b) the RESTRICTED profile, because it effectively requires clients to use TLS 1.2 regardless of the chosen minimum TLS version;
 or (3) a CUSTOM profile that doesn't support any of the following features:
TLS_RSA_WITH_AES_128_GCM_SHA256
TLS_RSA_WITH_AES_256_GCM_SHA384
TLS_RSA_WITH_AES_128_CBC_SHA
TLS_RSA_WITH_AES_256_CBC_SHA
TLS_RSA_WITH_3DES_EDE_CBC_SHA

Load balancers are used to efficiently distribute traffic across multiple servers.
 Both SSL proxy and HTTPS load balancers are external load balancers, meaning they distribute traffic from the Internet to a GCP network.
 GCP customers can configure load balancer SSL policies with a minimum TLS version (1.0, 1.1, or 1.2) that clients can use to establish a connection, along with a profile (Compatible, Modern, Restricted, or Custom) that specifies permissible cipher suites.
 To comply with users using outdated protocols, GCP load balancers can be configured to permit insecure cipher suites.
 In fact, the GCP default SSL policy uses a minimum TLS version of 1.0 and a Compatible profile, which allows the widest range of insecure cipher suites.
 As a result, it's easy for customers to configure a load balancer without even knowing that they're permitting outdated cipher suites.

**Severity**: Medium

### [Ensure that Cloud DNS logging is enabled for all VPC networks](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c10bad5f-cd86-4ea0-a40c-5d31510da525)

**Description**: Cloud DNS logging records the queries from the name servers within your VPC to Stackdriver.
 Logged queries can come from Compute Engine VMs, GKE containers, or other GCP resources provisioned within the VPC.
Security monitoring and forensics can't depend solely on IP addresses from VPC flow logs, especially when considering the dynamic IP usage of cloud resources, HTTP virtual host routing,
and other technology that can obscure the DNS name used by a client from the IP address.
Monitoring of Cloud DNS logs provides visibility to DNS names requested by the clients within the VPC.
These logs can be monitored for anomalous domain names, evaluated against threat intelligence, and
Note: For full capture of DNS, firewall must block egress UDP/53 (DNS)
and TCP/443 (DNS over HTTPS) to prevent client from using external DNS name server for resolution.

**Severity**: High

### [Ensure that DNSSEC is enabled for Cloud DNS](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/33509176-9e4d-4238-84ec-984ba67019fa)

**Description**: Cloud Domain Name System (DNS) is a fast, reliable, and cost-effective domain name system that powers millions of domains on the internet.
 Domain Name System Security Extensions (DNSSEC) in Cloud DNS enables domain owners to take easy steps to protect their domains against DNS hijacking and man-in-the-middle and other attacks.
 Domain Name System Security Extensions (DNSSEC) adds security to the DNS protocol by enabling DNS responses to be validated.
 Having a trustworthy DNS that translates a domain name like `www.example.com` into its associated IP address is an increasingly important building block of today's web-based applications.
 Attackers can hijack this process of domain/IP lookup and redirect users to a malicious site through DNS hijacking and man-in-the-middle attacks.
 DNSSEC helps mitigate the risk of such attacks by cryptographically signing DNS records.
 As a result, it prevents attackers from issuing fake DNS responses that might misdirect browsers to nefarious websites.

**Severity**: Medium

### [Ensure that RDP access is restricted from the Internet](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8bc8464f-f32a-4b3c-954e-48f9db2d9bcf)

**Description**: GCP Firewall Rules are specific to a VPC Network. Each rule either allows or denies traffic when its conditions are met. Its conditions allow users to specify the type of traffic, such as ports and protocols, and the source or destination of the traffic, including IP addresses, subnets, and instances.
Firewall rules are defined at the VPC network level and are specific to the network in which they're defined. The rules themselves can't be shared among networks. Firewall rules only support IPv4 traffic.
When specifying a source for an ingress rule or a destination for an egress rule by address, an IPv4 address or IPv4 block in CIDR notation can be used. Generic (0.0.0.0/0) incoming traffic from the Internet to a VPC or VM instance using RDP on Port 3389 can be avoided.
 GCP Firewall Rules within a VPC Network. These rules apply to outgoing (egress) traffic from instances and incoming (ingress) traffic to instances in the network.
 Egress and ingress traffic flows are controlled even if the traffic stays within the network (for example, instance-to-instance communication). For an instance to have outgoing Internet access, the network must have a valid Internet gateway route or custom route whose destination IP is specified.
 This route simply defines the path to the Internet, to avoid the most general (0.0.0.0/0) destination IP Range specified from the Internet through RDP with the default Port 3389. Generic access from the Internet to a specific IP Range should be restricted.

**Severity**: High

### [Ensure that RSASHA1 is not used for the key-signing key in Cloud DNS DNSSEC](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/87356ecc-b718-442d-af22-677bceaeae06)

**Description**: DNSSEC algorithm numbers in this registry might be used in CERT RRs.
 Zone signing (DNSSEC) and transaction security mechanisms (SIG(0) and TSIG) make use of particular subsets of these algorithms.
 The algorithm used for key signing should be a recommended one and it should be strong.
 Domain Name System Security Extensions (DNSSEC) algorithm numbers in this registry might be used in CERT RRs.
 Zonesigning (DNSSEC) and transaction security mechanisms (SIG(0) and TSIG) make use of particular subsets of these algorithms.
 The algorithm used for key signing should be a recommended one and it should be strong.
 When enabling DNSSEC for a managed zone, or creating a managed zone with DNSSEC, the user can select the DNSSEC signing algorithms and the denial-of-existence type.
 Changing the DNSSEC settings is only effective for a managed zone if DNSSEC isn't already enabled.
 If there's a need to change the settings for a managed zone where it has been enabled, turn off DNSSEC and then re-enable it with different settings.

**Severity**: Medium

### [Ensure that RSASHA1 is not used for the zone-signing key in Cloud DNS DNSSEC](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/117ad72e-fed7-4dc8-995d-39919b9ba2d9)

**Description**: DNSSEC algorithm numbers in this registry might be used in CERT RRs.
 Zone signing (DNSSEC) and transaction security mechanisms (SIG(0) and TSIG) make use of particular subsets of these algorithms.
 The algorithm used for key signing should be a recommended one and it should be strong.
 DNSSEC algorithm numbers in this registry might be used in CERT RRs.
 Zonesigning (DNSSEC) and transaction security mechanisms (SIG(0) and TSIG) make use of particular subsets of these algorithms.
 The algorithm used for key signing should be a recommended one and it should be strong.
 When enabling DNSSEC for a managed zone, or creating a managed zone with DNSSEC, the DNSSEC signing algorithms, and the denial-of-existence type can be selected.
 Changing the DNSSEC settings is only effective for a managed zone if DNSSEC isn't already enabled.
 If the need exists to change the settings for a managed zone where it has been enabled, turn off DNSSEC and then re-enable it with different settings.

**Severity**: Medium

### [Ensure that SSH access is restricted from the internet](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9f88a5b8-2853-4b3f-a4c7-33f225cae99a)

**Description**: GCP Firewall Rules are specific to a VPC Network. Each rule either allows or denies traffic when its conditions are met. Its conditions allow the user to specify the type of traffic, such as ports and protocols, and the source or destination of the traffic, including IP addresses, subnets, and instances.
Firewall rules are defined at the VPC network level and are specific to the network in which they're defined. The rules themselves can't be shared among networks. Firewall rules only support IPv4 traffic.
When specifying a source for an ingress rule or a destination for an egress rule by address, only an IPv4 address or IPv4 block in CIDR notation can be used. Generic (0.0.0.0/0) incoming traffic from the internet to VPC or VM instance using SSH on Port 22 can be avoided.
 GCP Firewall Rules within a VPC Network apply to outgoing (egress) traffic from instances and incoming (ingress) traffic to instances in the network.
Egress and ingress traffic flows are controlled even if the traffic stays within the network (for example, instance-to-instance communication).
For an instance to have outgoing Internet access, the network must have a valid Internet gateway route or custom route whose destination IP is specified.
This route simply defines the path to the Internet, to avoid the most general (0.0.0.0/0) destination IP Range specified from the Internet through SSH with the default Port '22.'
 Generic access from the Internet to a specific IP Range needs to be restricted.

**Severity**: High

### [Ensure that the default network does not exist in a project](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ea1989f3-de6c-4389-8b6c-c8b9a3df1595)

**Description**: To prevent use of "default" network, a project shouldn't have a "default" network.
 The default network has a preconfigured network configuration and automatically generates the following insecure firewall rules:

- default-allow-internal: Allows ingress connections for all protocols and ports among instances in the network.
- default-allow-ssh: Allows ingress connections on TCP port 22(SSH) from any source to any instance in the network.
- default-allow-rdp: Allows ingress connections on TCP port 3389(RDP) from any source to any instance in the network.
- default-allow-icmp: Allows ingress ICMP traffic from any source to any instance in the network.

These automatically created firewall rules don't get audit logged and can't be configured to enable firewall rule logging.
Furthermore, the default network is an auto mode network, which means that its subnets use the same predefined range of IP addresses, and as a result, it's not possible to use Cloud VPN or VPC Network Peering with the default network.
Based on organization security and networking requirements, the organization should create a new network and delete the default network.

**Severity**: Medium

### [Ensure that the log metric filter and alerts exist for VPC network changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/59aef38a-19c2-4663-97a7-4c82a98dbab5)

**Description**: It's recommended that a metric filter and alarm be established for Virtual Private Cloud (VPC) network changes.
It's possible to have more than one VPC within a project. In addition, it's also possible to create a peer connection between two VPCs enabling network traffic to route between VPCs.
Monitoring changes to a VPC will help ensure VPC traffic flow isn't getting impacted.

**Severity**: Low

### [Ensure that the log metric filter and alerts exist for VPC Network Firewall rule changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4a7723f9-ee51-4a2b-a4e5-2497a20c1964)

**Description**: It's recommended that a metric filter and alarm be established for Virtual Private Cloud (VPC) Network Firewall rule changes.
Monitoring for Create or Update Firewall rule events gives insight to network access changes and might reduce the time it takes to detect suspicious activity.

**Severity**: Low

### [Ensure that the log metric filter and alerts exist for VPC network route changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b5c8e32b-a400-4d4b-8d2d-c5afbd4a6997)

**Description**: It's recommended that a metric filter and alarm be established for Virtual Private Cloud (VPC) network route changes.
Google Cloud Platform (GCP) routes define the paths network traffic takes from a VM instance to another destination. The other destination can be inside the organization VPC network (such as another VM) or outside of it. Every route consists of a destination and a next hop. Traffic whose destination IP is within the destination range is sent to the next hop for delivery.
Monitoring changes to route tables will help ensure that all VPC traffic flows through an expected path.

**Severity**: Low

### [Ensure that the 'log_connections' database flag for Cloud SQL PostgreSQL instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4016e27f-a451-4e24-9222-39d7d107ad74)

**Description**: Enabling the log_connections setting causes each attempted connection to the server to be logged, along with successful completion of client authentication. This parameter can't be changed after the session starts.
PostgreSQL doesn't log attempted connections by default. Enabling the log_connections setting will create log entries for each attempted connection as well as successful completion of client authentication, which can be useful in troubleshooting issues and to determine any unusual connection attempts to the server.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Medium

### [Ensure that the 'log_disconnections' database flag for Cloud SQL PostgreSQL instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a86f62be-7402-4797-91dc-8ba2b976cb74)

**Description**: Enabling the log_disconnections setting logs the end of each session, including the session duration.
PostgreSQL doesn't log session details such as duration and session end by default. Enabling the log_disconnections setting will create log entries at the end of each session, which can be useful in troubleshooting issues and determine any unusual activity across a time period.
The log_disconnections and log_connections work hand in hand and generally, the pair would be enabled/disabled together. This recommendation is applicable to PostgreSQL database instances.

**Severity**: Medium

### [Ensure that VPC Flow Logs is enabled for every subnet in a VPC Network](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/25631aaa-3866-43ac-860f-22c12bff1a4b)

**Description**: Flow Logs is a feature that enables users to capture information about the IP traffic going to and from network interfaces in the organization's VPC Subnets. Once a flow log is created, the user can view and retrieve its data in Stackdriver Logging.
 It's recommended that Flow Logs be enabled for every business-critical VPC subnet.
VPC networks and subnetworks provide logically isolated and secure network partitions where GCP resources can be launched. When Flow Logs is enabled for a subnet, VMs within that subnet start reporting on all Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) flows.
 Each VM samples the TCP and UDP flows it sees, inbound and outbound, whether the flow is to or from another VM, a host in the on-premises datacenter, a Google service, or a host on the Internet. If two GCP VMs are communicating, and both are in subnets that have VPC Flow Logs enabled, both VMs report the flows.
Flow Logs supports the following use cases: 1. Network monitoring. 2. Understanding network usage and optimizing network traffic expenses. 3. Network forensics. 4. Real-time security analysis
Flow Logs provide visibility into network traffic for each VM inside the subnet and can be used to detect anomalous traffic or insight during security workflows.

**Severity**: Low

### [Firewall rule logging should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/37e5206e-a928-416b-9851-3689f506f73f)

**Description**: This recommendation evaluates the logConfig property in firewall metadata to see if it's empty or contains the key-value pair 'enable': false.

**Severity**: Medium

### [Firewall should not be configured to be open to public access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/98c71657-9a57-4a9c-8cc0-e69136b9ec13)

**Description**: This recommendation evaluates the sourceRanges and allowed properties for one of two configurations:

 The sourceRanges property contains 0.0.0.0/0 and the allowed property contains a combination of rules that includes any protocol or protocol:port, except the following:
 icmp
 tcp:22
 tcp:443
 tcp:3389
 udp:3389
 sctp:22

 The sourceRanges property contains a combination of IP ranges that includes any nonprivate IP address and the allowed property contains a combination of rules that permit either all tcp ports or all udp ports.

**Severity**: High

### [Firewall should not be configured to have an open CASSANDRA port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/06ee058b-9ba9-4a54-a6d3-7214703d309f)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:7000-7001, 7199, 8888, 9042, 9160, 61620-61621.

**Severity**: Low

### [Firewall should not be configured to have an open CISCOSECURE_WEBSM port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/87cb47d9-eb93-4413-be7f-2f89112d3e22)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocol and port: TCP:9090.

**Severity**: Low

### [Firewall should not be configured to have an open DIRECTORY_SERVICES port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9c59d6ae-79c9-4f74-bacd-9bb8d2b05576)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:445 and UDP:445.

**Severity**: Low

### [Firewall should not be configured to have an open DNS port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/99fa8cd5-10fc-4051-909c-62a6d1272956)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:53 and UDP:53.

**Severity**: Low

### [Firewall should not be configured to have an open ELASTICSEARCH port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9c39d3a7-a11d-4f1e-a5b8-8c3be23fe0d1)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:9200, 9300.

**Severity**: Low

### [Firewall should not be configured to have an open FTP port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/14dae408-be1b-4ab9-8645-1d9eba885a3e)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocol and port: TCP:21.

**Severity**: Low

### [Firewall should not be configured to have an open HTTP port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d6e19ca8-7446-4b1a-87e9-fb0bee876c80)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:80.

**Severity**: Low

### [Firewall should not be configured to have an open LDAP port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/114491f8-1760-40b9-ad56-04be9c0be1d6)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:389, 636 and UDP:389.

**Severity**: Low

### [Firewall should not be configured to have an open MEMCACHED port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dcbfebbd-0d89-4605-b29c-a8b94a11ca4c)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:11211, 11214-11215 and UDP:11211, 11214-11215.

**Severity**: Low

### [Firewall should not be configured to have an open MONGODB port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0088a052-38cd-4ef3-80bc-982871756481)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:27017-27019.

**Severity**: Low

### [Firewall should not be configured to have an open MYSQL port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/184a6210-9eb3-4d41-9453-84fd7f01186e)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocol and port: TCP:3306.

**Severity**: Low

### [Firewall should not be configured to have an open NETBIOS port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f39b9212-7c2e-4265-85ad-14701b0209e3)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:137-139 and UDP:137-139.

**Severity**: Low

### [Firewall should not be configured to have an open ORACLEDB port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/802bc806-5136-461f-a95d-dd65f8725af0)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:1521, 2483-2484 and UDP:2483-2484.

**Severity**: Low

### [Firewall should not be configured to have an open POP3 port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4f5e97a0-d563-4c0a-8aca-958753dfbeb6)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocol and port: TCP:110.

**Severity**: Low

### [Firewall should not be configured to have an open PostgreSQL port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/27d1143d-a7ab-405c-a80c-8b9da25bc5e4)

**Description**: This recommendation evaluates the allowed property in firewall metadata for the following protocols and ports: TCP:5432 and UDP:5432.

**Severity**: Low

### [Firewall should not be configured to have an open REDIS port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9a7b9056-30af-476f-bdc8-8b421d29b5e3)

**Description**: This recommendation evaluates whether the allowed property in firewall metadata contains the following protocol and port: TCP:6379.

**Severity**: Low

### [Firewall should not be configured to have an open SMTP port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5855b7ce-fded-464c-894c-d34bd834f17e)

**Description**: This recommendation evaluates whether the allowed property in firewall metadata contains the following protocol and port: TCP:25.

**Severity**: Low

### [Firewall should not be configured to have an open SSH port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4c8753af-c7d5-404f-abdf-8e8bef018dc9)

**Description**: This recommendation evaluates whether the allowed property in firewall metadata contains the following protocols and ports: TCP:22 and SCTP:22.

**Severity**: Low

### [Firewall should not be configured to have an open TELNET port that allows generic access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bdb01af7-e42a-49c6-952f-b83ce13914a7)

**Description**: This recommendation evaluates whether the allowed property in firewall metadata contains the following protocol and port: TCP:23.

**Severity**: Low

### [GKE clusters should have alias IP ranges enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/49016ecd-d4d6-4f48-a64f-42af93e15120)

**Description**: This recommendation evaluates whether the useIPAliases field of the ipAllocationPolicy in a cluster is set to false.

**Severity**: Low

### [GKE clusters should have Private clusters enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d3e70cff-e4db-47b1-b646-0ac5ed8ada36)

**Description**: This recommendation evaluates whether the enablePrivateNodes field of the privateClusterConfig property is set to false.

**Severity**: High

### [Network policy should be enabled on GKE clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fd06513a-1e03-4d40-9159-243f76dcdcb7)

**Description**: This recommendation evaluates the networkPolicy field of the addonsConfig property for the key-value pair, 'disabled': true.

**Severity**: Medium

## Related content

- [Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](review-security-recommendations.md)
