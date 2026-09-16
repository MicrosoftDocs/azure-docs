---

title: Collect esxtop performance data using Run Command

description: Learn how to collect esxtop performance data from ESXi hosts in Azure VMware Solution using the Get-EsxtopData Run Command.

ms.topic: how-to

ms.service: azure-vmware

ms.custom: engagement-fy26

ms.date: 04/07/2026

# Customer intent: As a cloud administrator, I want to collect esxtop performance data from ESXi hosts in Azure VMware Solution, so that I can troubleshoot performance issues without requiring direct SSH access.

---

  

# Collect esxtop performance data using Run Command

  

In this article, learn how to use the `Get-EsxtopData` Run Command in Azure VMware Solution to collect batch-mode [esxtop](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.monitoring.doc/GUID-D89E8267-C74A-496F-B58E-19672CAB5B53.html) performance snapshots from a single ESXi host through the vCenter Server `ServiceManager` API and upload the resulting CSV file to a datastore. The command doesn't require SSH access to the ESXi host.

  

Use this command to capture low-level CPU, memory, network, and storage metrics for performance troubleshooting.

  

## Prerequisites

  

Before you collect esxtop data, make sure that:

  

- You have access to the Azure portal with permissions equivalent to the **cloudadmin** role for the Azure VMware Solution private cloud.

- You're using the latest supported version of the **Microsoft.AVS.Management** Run Command package.

- The target ESXi host is in the **Connected** state within the specified cluster.

- A vSAN datastore (or a customer-specified datastore) is accessible on the cluster for CSV upload.

  

## Run Command parameters: `Get-EsxtopData`

  

- **ClusterName** — Name of the vSphere cluster that contains the target ESXi host. For example, `Cluster-1`.

- **EsxiHostName** — ESXi host name or name prefix. The first connected host that matches this prefix is used. For example, `esx01`.

- **Iterations** — Number of esxtop snapshots to collect. Valid values are `1` through `6`. The default value is `6`. Combined with **IntervalSeconds**, the total spacing between the first and last sample must not exceed 30 seconds: `(Iterations - 1) * IntervalSeconds <= 30`.

- **IntervalSeconds** — Number of seconds to wait between snapshots. Valid values are `2` through `30`. The default value is `5`. The minimum of `2` seconds aligns with the esxtop minimum sampling interval.

- **OutputDatastoreName** — Name of the datastore to upload the CSV file to. When omitted, the value defaults to the first vSAN datastore on the cluster. Specify this parameter to use a non-vSAN datastore, or when automatic vSAN discovery doesn't find the desired target.

- **Retain up to** — Retention period of the cmdlet output. The default value is `60`.

- **Specify name for execution** — Alphanumeric name. For example, *Get-EsxtopData-Exec1*.

- **Timeout** — The period after which a cmdlet exits if it's taking too long to finish.

  

## Collect esxtop data

  

1. Go to your Azure VMware Solution private cloud in the Azure portal.

  

1. Select **Run command** > **Packages** > **Microsoft.AVS.Management**.

  

1. Select **Get-EsxtopData**.

  

1. Provide the required values, or change the default values based on the preceding parameters list. Then select **Run**.

  

> [!NOTE]
> The **ClusterName** and **EsxiHostName** fields are required. All other fields have default values and are optional.


  

The CSV file contains the following columns:

  

- **Timestamp** — The date and time when the sample was captured (`yyyy-MM-dd HH:mm:ss`).

- **SampleNumber** — Sequential sample number (`1` through *Iterations*).

- **RawData** — Raw esxtop counter data returned by the vCenter Server esxtop `FetchStats` API.

  

Use the counter metadata from the esxtop `CounterInfo` API call to map raw data fields to specific performance metrics (CPU, memory, network, and disk).

  

## Best practices and safety guidance

  

- Start with the default values (**6** iterations and **5**-second intervals) for a quick 25-second capture window.

- The total sampling window is limited to **30 seconds** between the first and last sample. Exceeding this limit (`(Iterations - 1) * IntervalSeconds > 30`) results in an error.

- If you need longer collection periods, run the command multiple times and correlate the output files by timestamp.

- Use **OutputDatastoreName** when the cluster has multiple datastores or when automatic vSAN datastore discovery doesn't select the desired target.

- The command doesn't require SSH access. It uses the vCenter Server `ServiceManager` API to collect data.

- The command doesn't modify the software-defined datacenter (SDDC) or any host configuration (`UpdatesSDDC = false`).

  

## Next steps

  

- Download the CSV file from `[datastore]/esxtop_output/` by using the vSphere Client or datastore browser.

- Use the [VMware esxtop counter reference](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.monitoring.doc/GUID-D89E8267-C74A-496F-B58E-19672CAB5B53.html) to interpret the raw performance data.