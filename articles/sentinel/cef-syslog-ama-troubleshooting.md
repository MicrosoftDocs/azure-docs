---
title: Troubleshoot CEF and Syslog via AMA connectors in Microsoft Sentinel
description: Learn how to troubleshoot issues with CEF and Syslog data collection using the Azure Monitor Agent (AMA) in Microsoft Sentinel.
author: EdB-MSFT
ms.author: edbaynash
ms.topic: troubleshooting
ms.date: 01/12/2026

# cusomtomer intent: As a Microsoft Sentinel administrator, I want to troubleshoot issues with CEF and Syslog data collection using the Azure Monitor Agent (AMA) so that I can ensure logs are being ingested correctly.
---

# Troubleshoot CEF and Syslog via AMA connectors

This article provides troubleshooting guidance for Common Event Format (CEF) and Syslog data collection using the Azure Monitor Agent (AMA) in Microsoft Sentinel. Use this guide to diagnose and resolve ingestion issues with your log forwarder machines. The commands and configurations should be run on the log forwarder machines where AMA and RSyslog/Syslog-ng are installed.

Before you begin troubleshooting, familiarize yourself with the following articles:

- [Ingest syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md)
- [CEF via AMA data connector - Configure specific appliance or device](cef-syslog-ama-overview.md)
- [Azure Monitor Agent overview](/azure/azure-monitor/agents/azure-monitor-agent-overview)

## Architecture overview

The following diagram illustrates the data flow from log sources to Microsoft Sentinel/log analytics workspaces via RSyslog and the Azure Monitor Agent.

:::image type="content"source="./media/cef-syslog-ama-troubleshooting/ama-flow.png" lightbox="./media/cef-syslog-ama-troubleshooting/ama-flow.png" alt-text="Diagram showing data flow from source to Log Analytics via RSyslog and AMA.":::

Key components:
- **RSyslog/Syslog-ng**: Receives logs on port 514 and forwards them to AMA
- **Azure Monitor Agent**: Processes logs according to Data Collection Rules (DCR)
- **Data Collection Rule**: Defines which logs to collect and where to send them

## Initial verification steps

### Verify logs are being received

Logs can take up to 20 minutes to appear in Microsoft Sentinel after configuration.

1. Run tcpdump to verify logs are arriving at the forwarder:

   ```bash
   sudo tcpdump -i any port 514 -A -vv
   ```

2. Verify your log source is configured to send messages to the correct forwarder IP address.

3. Check for infrastructure components that might affect connectivity:
   - Firewalls
   - Load balancers
   - Network security groups

### Check Azure Monitor Agent extension status

1. In the Azure portal, navigate to your log forwarder virtual machine.
2. Select **Extensions + applications**.
3. Select the **AzureMonitorLinuxAgent** extension.
4. Verify that **Status** shows **Provisioning succeeded**.

### Verify agent version

1. In the **AzureMonitorLinuxAgent** extension blade, check the **Version** field.
2. Ensure the version is one of the 2-3 most recent releases. See [AMA version details](/azure/azure-monitor/agents/azure-monitor-agent-manage#agent-versions) for the latest versions.

> [!NOTE]
> New versions may take up to 5 weeks to roll out after initial release.

## Agent-level troubleshooting

Make sure that the agent and RSyslog services are running.
```bash
sudo systemctl status azuremonitoragent
sudo systemctl status rsyslog
sudo systemctl status syslog-ng.service # If using Syslog-ng
```   

### Verify RSyslog configuration

The RSyslog configuration consists of `/etc/rsyslog.conf` and files in `/etc/rsyslog.d/`.

1. Verify port configuration:

   ```bash
   grep -E 'imudp|imtcp' /etc/rsyslog.conf
   ```

   Expected output:

   ```
   module(load="imudp")
   input(type="imudp" port="514")
   module(load="imtcp")
   input(type="imtcp" port="514")
   ```

2. Verify the AMA forwarding configuration exists:

   ```bash
   cat /etc/rsyslog.d/10-azuremonitoragent-omfwd.conf
   ```

   The file should start with:

   ```
   # Azure Monitor Agent configuration: forward logs to azuremonitoragent
   ```

### Verify port status

Check that the required ports are listening:

```bash
sudo ss -lnp | grep -E "28330|514"
```

Expected output:

```
udp   UNCONN 0      0      0.0.0.0:514         0.0.0.0:*    users:(("rsyslogd",pid=12289,fd=5))
tcp   LISTEN 0      10     127.0.0.1:28330     0.0.0.0:*    users:(("mdsd",pid=1424,fd=1363))
tcp   LISTEN 0      25     0.0.0.0:514         0.0.0.0:*    users:(("rsyslogd",pid=12289,fd=7))
```

This confirms:
- RSyslog is listening on port 514 (TCP and UDP)
- MDSD (AMA component) is listening on port 28330 (TCP)

### Verify Data Collection Rule configuration

Check if the DCR is properly configured on the agent.

For CEF logs:

```bash
sudo grep -i -r "SECURITY_CEF_BLOB" /etc/opt/microsoft/azuremonitoragent/config-cache/configchunks
```

For Cisco ASA logs:

```bash
sudo grep -i -r "SECURITY_CISCO_ASA_BLOB" /etc/opt/microsoft/azuremonitoragent/config-cache/configchunks
```

The output should show a JSON string containing the DCR configuration.

### Review firewall rules

Ensure firewall rules allow communication between:
- Log source and RSyslog (port 514)
- RSyslog and AMA (port 28330)
- AMA and Azure endpoints

## Data Collection Rule configuration

### Enable all facilities for troubleshooting

For initial troubleshooting:

1. In the Azure portal, navigate to your Data Collection Rule.
2. Enable all syslog facilities.
3. Select all log levels.
4. If available, enable collection of messages with no facility or severity.

For more information, see [Select facilities and severities](connect-cef-syslog-ama.md).

## Common Event Format (CEF) validation

### CEF format requirements

CEF uses Syslog as a transport mechanism with this structure:

```
<Priority>Timestamp Hostname CEF:Version|Device Vendor|Device Product|Device Version|Device Event Class ID|Name|Severity|[Extension]
```

Example:

```
Jan 18 11:07:53 host CEF:0|Vendor|Product|1.0|100|EventName|5|src=10.0.0.1 dst=10.0.0.2
```

### Common CEF formatting issues

**Incorrect header format**
- Ensure the CEF version is present: `CEF:0|`
- All header fields must be present and delimited by pipe (|) characters

**Improper character escaping**
- Pipe characters (|) in header values must be escaped: `\|`
- Backslashes (\) must be escaped: `\\`
- Equal signs (=) in extensions must be escaped: `\=`

**Missing or unmapped values**
- If a value can't be mapped to a standard field, it's stored in the `AdditionalExtensions` column
- See [CEF and CommonSecurityLog field mapping](cef-name-mapping.md) for field mappings

For the complete CEF specification, search for "Implementing ArcSight Common Event Format (CEF)" documentation.

## Advanced troubleshooting

### Enable diagnostic tracing

> [!WARNING]
> Enable trace flags only for troubleshooting sessions. Trace flags generate extensive logging that can fill disk space quickly.

1. Edit the AMA configuration file:

   ```bash
   sudo vim /etc/default/azuremonitoragent
   ```

2. Add trace flags to the MDSD_OPTIONS line:

   ```bash
   export MDSD_OPTIONS="-A -c /etc/opt/microsoft/azuremonitoragent/mdsd.xml -d -r $MDSD_ROLE_PREFIX -S $MDSD_SPOOL_DIRECTORY/eh -L $MDSD_SPOOL_DIRECTORY/events -e $MDSD_LOG_DIR/mdsd.err -w $MDSD_LOG_DIR/mdsd.warn -o $MDSD_LOG_DIR/mdsd.info -T 0x2002"
   ```

3. Restart the agent:

   ```bash
   sudo systemctl restart azuremonitoragent
   ```

4. Reproduce the issue and wait a few minutes.

5. Review debug information in `/var/opt/microsoft/azuremonitoragent/log/mdsd.info`.

6. Remove the trace flag and restart the agent after troubleshooting.

### Monitor log processing in real-time

View incoming logs as they're processed:

```bash
tail -f /var/opt/microsoft/azuremonitoragent/log/mdsd.info
```

Filter for specific log types:

```bash
sudo tail -f /var/opt/microsoft/azuremonitoragent/log/mdsd.* | grep -a "CEF"
```

Review specific facility logs:

```bash
grep local0.info /var/opt/microsoft/azuremonitoragent/log/mdsd.info
```

### Verify successful log processing

When trace flags are enabled, you can verify that logs are being processed correctly by examining the debug output.

#### ASA log ingestion example

For Cisco ASA logs, successful processing appears in the logs as:

```
2022-01-18T22:00:14.8650520Z: virtual bool Pipe::SyslogCiscoASAPipeStage::PreProcess(std::shared_ptr<CanonicalEntity>) (.../mdsd/PipeStages.cc +604) [PipeStage] Processing CiscoASA event '%ASA-1-105003: (Primary) Monitoring on 123'

2022-01-18T22:00:14.8651330Z: virtual void ODSUploader::execute(const MdsTime&) (.../mdsd/ODSUploader.cc +325) Uploading 1 SECURITY_CISCO_ASA_BLOB rows to ODS.

2022-01-18T22:00:14.8653090Z: int ODSUploader::UploadFixedTypeLogs(const string&, const string&, const std::function<void(bool, long unsigned int, int, long unsigned int)>&, int, uint64_t) (.../mdsd/ODSUploader.cc +691) Uploading to ODS with request 3333-44dd-555555eeeeee Host https://00001111-aaaa-2222-bbbb-3333cccc4444.ods.opinsights.azure.com for datatype SECURITY_CISCO_ASA_BLOB. Payload: {"DataType":"SECURITY_CISCO_ASA_BLOB","IPName":"SecurityInsights","ManagementGroupId":"00000000-0000-0000-0000-000000000002","sourceHealthServiceId":"2c2c2c2c-3333-dddd-4444-5e5e5e5e5e5e","type":"JsonData","DataItems":[{"Facility":"local0","SeverityNumber":"6","Timestamp":"2022-01-14T23:28:49.775619Z","HostIP":"127.0.0.1","Message":" (Primary) Monitoring on 123","ProcessId":"","Severity":"info","Host":"localhost","ident":"%ASA-1-105003"}]}. Uncompressed size: 443. Request size: 322
```

Key indicators of successful processing:
- The event is recognized as a CiscoASA event
- The log is uploaded to ODS (Operations Data Service)
- A request ID is generated for tracking
- The payload contains properly formatted JSON data

#### CEF log ingestion example

For CEF logs, successful processing appears as:

```
2022-01-14T23:09:13.9087860Z: int ODSUploader::UploadFixedTypeLogs(const string&, const string&, const std::function<void(bool, long unsigned int, int, long unsigned int)>&, int, uint64_t) (.../mdsd/ODSUploader.cc +691) Uploading to ODS with request 3333-44dd-555555eeeeee Host https://00001111-aaaa-2222-bbbb-3333cccc4444.ods.opinsights.azure.com for datatype SECURITY_CEF_BLOB. Payload: {"DataType":"SECURITY_CEF_BLOB","IPName":"SecurityInsights","ManagementGroupId":"00000000-0000-0000-0000-000000000002","sourceHealthServiceId":"2c2c2c2c-3333-dddd-4444-5e5e5e5e5e5e","type":"JsonData","DataItems":[{"Facility":"local0","SeverityNumber":"6","Timestamp":"2022-01-14T23:08:49.731862Z","HostIP":"127.0.0.1","Message":"0|device1|PAN-OS|8.0.0|general|SYSTEM|3|rt=Nov 04 2018 07:15:46 GMTcs3Label=Virtual","ProcessId":"","Severity":"info","Host":"localhost","ident":"CEF"}]}. Uncompressed size: 482. Request size: 350
```

Key indicators of successful CEF processing:
- The datatype is SECURITY_CEF_BLOB
- The upload request includes a valid endpoint
- The CEF message structure is preserved in the payload
- Compression metrics show the data is being optimized for transfer

> [!IMPORTANT]
> Remember to disable trace flags after completing your investigation to prevent excessive disk usage.

## Collect diagnostic information

Before opening a support case, collect the following information:

### Run the AMA troubleshooter

The script can be run with specific flags for different log types.
- `--cef`: For Common Event Format logs
- `--asa`: For Cisco ASA logs 
- `--ftd`: For Cisco Firepower Threat Defense logs

The output is saved to `/tmp/troubleshooter_output_file.log`.

```bash
sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py && sudo python3 Sentinel_AMA_troubleshoot.py [--cef | --asa | --ftd]
```

## Related content

- [Ingest syslog and CEF messages with Azure Monitor Agent](connect-cef-syslog-ama.md)
- [CEF and Syslog via AMA connectors overview](cef-syslog-ama-overview.md)
- [Troubleshoot the Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-troubleshoot-linux-vm)
- [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)
