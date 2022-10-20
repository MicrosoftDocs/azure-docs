---
title: OT sensor configuration CLI commands - Microsoft Defender for IoT
description: Learn about the CLI commands available for configuring Microsoft Defender for IoT OT network sensors.
ms.date: 09/07/2022
ms.topic: reference
---

# OT sensor configuration CLI commands

## Manage SSL and TLS certificates

Use the following command to import SSL and TLS certificates to the sensor from the CLI.

To use this command:

- Verify that the certificate file you want to import is readable on the appliance. Upload certificate files to the appliance using tools such as WinSCP or Wget.
- Confirm with your IT office that the appliance domain as it appears in the certificate is correct for your DNS server and the corresponding IP address.

For more information, see [Certificates for appliance encryption and authentication (OT appliances)](../how-to-deploy-certificates.md).

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **cyberx** | `cyberx-xsense-certificate-import` | cyberx-xsense-certificate-import [-h] [--crt &lt;PATH&gt;] [--key &lt;FILE NAME&gt;] [--chain &lt;PATH&gt;] [--pass &lt;PASSPHRASE&gt;] [--passphrase-set &lt;VALUE&gt;]`

In this command:

- `-h`: Shows the full command help syntax
- `--crt`: The path to the certificate file you want to upload, with a `.crt` extension
- `--key`: The `\*.key` file you want to use for the certificate. Key length must be a minimum of 2,048 bits
- `--chain`: The path to a certificate chain file. Optional.
- `--pass`: A passphrase used to encrypt the certificate. Optional.
- `--passphrase-set`: Unused and set to *False* by default. Set to *True* to use passphrase supplied with the previous certificate. Optional.

For example, for the *cyberx* user:

```bash
root@xsense:/# cyberx-xsense-certificate-import
```

<!--better example with attributes showing and also response?-->

## Trigger test alert
With the following command, you can test connectivity and alert forwarding from the sensor to management products such as the Azure portal, on-premises management console, or third-party SIEM.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|  | `` | ``|

## Review audit logs

An audit log of sensor activity can be reviewed from the command line using the following command.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|  | `` | ``|

## Apply ingress traffic filters (capture filter)

### Block by IP address range

### Block by port

### Base capture filter

## Local alert suppression

### Show alert suppression rules
Enter the following command to present the existing list of exclusion rules:

```azurecli-interactive
alerts exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

### Create new alert suppression rule
You can create a local alert exclusion rule by entering the following command into the CLI:

```azurecli-interactive
alerts exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The following attributes can be used with the alert exclusion rules:

| Attribute | Description |
|--|--|
| [-h] | Prints the help information for the command. |
| -n NAME | The name of the rule being created. |
| [-ts TIMES] | The time span for which the rule is active. This should be specified as:<br />`xx:yy-xx:yy`<br />You can define more than one time period by using a comma between them. For example: `xx:yy-xx:yy, xx:yy-xx:yy`. |
| [-dir DIRECTION] | The direction in which the rule is applied. This should be specified as:<br />`both | src | dst` |
| [-dev DEVICES] | The IP address and the address type of the devices to be excluded by the rule, specified as:<br />`ip-x.x.x.x`<br />`mac-xx:xx:xx:xx:xx:xx`<br />`subnet: x.x.x.x/x` |
| [-a ALERTS] | The name of the alert that the rule will exclude:<br />`0x00000`<br />`0x000001` |

### Append alert suppression rule
You can append local alert exclusion rules by entering the following command in the CLI:

```azurecli-interactive
alerts exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The attributes used here are the same as the attributes explained in the Create local alert exclusion rules section. The difference in the usage is that here the attributes are applied on the existing rules.

### Delete alert suppression rule
You can delete an existing alert exclusion rule by entering the following command:

```azurecli-interactive
alerts exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The following attribute can be used with the alert exclusion rules:

| Attribute | Description|
| --------- | ---------------------------------- |
| -n NAME | The name of the rule to be deleted. |

## Define clients and servers

## Update sensor software versions

The following procedure describes how to update OT sensor software versions using the CLI.

1. Mount the secured update file to the `/home/cyberx` directory, and then copy it to the `/tmp` directory. Run:

    ```bash
    cp /home/cyberx/<file name> /tmp
    ```

    where `<file name>` is the name of the update file

1. Verify that the update file isn't corrupted. Run:

    ```bash
	md5sum <filename>
    ```

    where `<file name>` is the name of the update file

1. Create the update flag required to start the update. Run:

    ```bash
    touch /var/cyberx/media/device-info/pending_update
    ```

1. If this isn't the first update being run on your sensor, make sure that no old files are in use. You can skip this step if the `/update` directory doesn't exist. Run:

    ```bash
    cd /update
    sudo rm -rf *
    ```
1. Stop the tomcat process:

    ```bash
	sudo monit stop tomcat
    ```

1. Extract the secured update file. Run:

    ```bash
    sudo /usr/local/bin/cyberx-update-extract --encrypted-file-path /tmp/<file name> --output-dir-path /var/cyberx/media/device-info/update
    ```

    Where `<file name>` is the name of the update file.

1. Start tomcat again. Run:

    ```bash
    sudo monit start tomcat
    ```

1. Make sure that you're in the correct directory for the update. Run:

    ```bash
    cd /home/cyberx
    ```

1. Run the update script. Run:

    ```bash
    sudo python /var/cyberx/media/device-info/update/setup_upgrade.py --pre_reboot
    ```

The update runs on the sensor. To track the updates progress, run:

```bash
tail -f /var/cyberx/logs/upgrade.log
```
## Manage local alert exclusions

<!--extra intro about what these are and xref to where we talk about them in the main docs-->

### Show local alert exclusion rules

Run one of the following commands to show the current alert exclusion rules:

|User  |Command  |Full command syntax |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-list`      |   `alerts exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-list`       |   `alerts cyberx-xsense-exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |

For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see [Alert exclusion rule attributes](#alert-exclusion-rule-attributes).

### Create local alert exclusion rules

Run one of the following commands to create a new local alert exclusion rule:

|User  |Command  |Full command syntax |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-create`      |   `alerts exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-create`       |   `alerts cyberx-xsense-exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |

For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see [Alert exclusion rule attributes](#alert-exclusion-rule-attributes).

### Append local alert exclusion rules

Create a local alert exclusion rule by running one of the following commands:

|User  |Command  |Full command syntax |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-append`      |   `alerts exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-append`       |   `alerts cyberx-xsense-exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |


For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see [Alert exclusion rule attributes](#alert-exclusion-rule-attributes).

### Delete local alert exclusion rules

Delete a local alert exclusion rule by running one of the following commands:

|User  |Command  |Full command syntax  |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-remove`      |   `alerts exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-remove`       |   `alerts cyberx-xsense-exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |


For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see [Alert exclusion rule attributes](#alert-exclusion-rule-attributes).

### Alert exclusion rule attributes

The following attributes are available for [creating](#create-local-alert-exclusion-rules) or [appending](#append-local-alert-exclusion-rules) alert exclusion rules.

| Attribute | Description |
|--|--|
| `[-h]` | Prints the help information for the command. |
| `-n NAME` | The name of the rule being created. |
| `[-ts TIMES]` | The time span for which the rule is active. This should be specified as:<br />`xx:yy-xx:yy`<br />You can define more than one time period by using a comma between them. For example: `xx:yy-xx:yy, xx:yy-xx:yy`. |
| `[-dir DIRECTION]` | The direction in which the rule is applied. This should be specified as:<br />`both | src | dst` |
|` [-dev DEVICES]` | The IP address and the address type of the devices to be excluded by the rule, specified as:<br />`ip-x.x.x.x`<br />`mac-xx:xx:xx:xx:xx:xx`<br />`subnet: x.x.x.x/x` |
| `[-a ALERTS]` | The name of the alert that the rule will exclude:<br />`0x00000`<br />`0x000001` |


## Manage network configurations

## Capture data filter
The `network capture-filter` command allows administrators to eliminate network traffic that doesn't need to be analyzed. You can filter traffic by using an include list, or an exclude list. This command doesn't support the malware detection engine.

```azurecli-interactive
network capture-filter
```

After you enter the command, you'll be prompted with the following question:

>`Would you like to supply devices and subnet masks you wish to include in the capture filter? [Y/N]:`

Select `Y` to open a nano file where you can add a device, channel, port, and subset according to the following syntax:

| Attribute | Description |
|--|--|
| 1.1.1.1 | Includes all of the traffic for this device. |
| 1.1.1.1,2.2.2.2 | Includes all of the traffic for this channel. |
| 1.1.1,2.2.2 | Includes all of the traffic for this subnet. |

Separate arguments by dropping a row.

When you include a device, channel, or subnet, the sensor processes all the valid traffic for that argument, including ports and traffic that wouldn't usually be processed.

You'll then be asked the following question:

>`Would you like to supply devices and subnet masks you wish to exclude from the capture filter? [Y/N]:`

Select `Y` to open a nano file where you can add a device, channel, port, and subsets according to the following syntax:

| Attribute | Description |
|--|--|
| 1.1.1.1 | Excludes all the traffic for this device. |
| 1.1.1.1,2.2.2.2 | Excludes all the traffic for this channel, meaning all the traffic between two devices. |
| 1.1.1.1,2.2.2.2,443 | Excludes all the traffic for this channel by port. |
| 1.1.1 | Excludes all the traffic for this subnet. |
| 1.1.1,2.2.2 | Excludes all the traffic for between subnets. |

Separate arguments by dropping a row.

When you exclude a device, channel, or subnet, the sensor will exclude all the valid traffic for that argument.

### Ports

Include or exclude UDP and TCP ports for all the traffic.

>`502`: single port

>`502,443`: both ports

>`Enter tcp ports to include (delimited by comma or Enter to skip):`

>`Enter udp ports to include (delimited by comma or Enter to skip):`

>`Enter tcp ports to exclude (delimited by comma or Enter to skip):`

>`Enter udp ports to exclude (delimited by comma or Enter to skip):`

### Components

You're asked the following question:

>`In which component do you wish to apply this capture filter?`

Your options are: `all`, `dissector`, `collector`, `statistics-collector`, `rpc-parser`, or `smb-parser`.

In most common use cases, we recommend that you select `all`. Selecting `all` doesn't include the malware detection engine, which isn't supported by this command.

### Custom base capture filter 

The base capture filter is the baseline for the components. For example, the filter determines which ports are available to the component.

Select `Y` for all of the following options. All of the filters are added to the baseline after the changes are set. If you make a change, it will overwrite the existing baseline.

>`Would you like to supply a custom base capture filter for the dissector component? [Y/N]:`

>`Would you like to supply a custom base capture filter for the collector component? [Y/N]:`

>`Would you like to supply a custom base capture filter for the statistics-collector component? [Y/N]:`

>`Would you like to supply a custom base capture filter for the rpc-parser component? [Y/N]:`

>`Would you like to supply a custom base capture filter for the smb-parser component? [Y/N]:`

>`Type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/N]:`

If you choose to exclude a subnet such as 1.1.1:

- `internal` will exclude only that subnet.

- `all-connected` will exclude that subnet and all the traffic to and from that subnet.

We recommend that you select `internal`.

> [!NOTE]
> Your choices are used for all the filters in the tool and are not session dependent. In other words, you can't ever choose `internal` for some filters and `all-connected` for others.

### Comments

You can view filters in ```/var/cyberx/properties/cybershark.properties```:

- **statistics-collector**: `bpf_filter property` in ```/var/cyberx/properties/net.stats.collector.properties```

- **dissector**: `override.capture_filter` property in ```/var/cyberx/properties/cybershark.properties```

- **rpc-parser**: `override.capture_filter` property in ```/var/cyberx/properties/rpc-parser.properties```

- **smb-parser**: `override.capture_filter` property in ```/var/cyberx/properties/smb-parser.properties```

- **collector**: `general.bpf_filter` property in ```/var/cyberx/properties/collector.properties```

You can restore the default configuration by entering the following code for the cyberx user:

```azurecli-interactive
sudo cyberx-xsense-capture-filter -p all -m all-connected
```


## template section

<!--do x--> by running one of the following commands:

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `<command>`      |   `<full command syntax with attributes`      |
|**cyberx**     |   `<command>`      |   `<full command syntax with attributes`      |


For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see <!--xref to section w attributes listed if we have any-->.

## Next steps

For more information, see [Getting started with the Defender for IoT CLI](cli-overview.md).
