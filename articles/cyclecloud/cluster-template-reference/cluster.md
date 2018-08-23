# Cluster

A Cluster Template file must have at least one `[cluster]` section with an inline name attribute.  It is the only required section of the file.


## Examples

Conventional cluster template files have a single cluster declaration.  

```ini
[cluster my-cluster]
    FormLayout = selectionpanel
    Category = My Templates
    CategoryOrder = 100
    MaxCount = 200
    Autoscale = $Autoscale

    [[node defaults]]
        Credentials = $Credentials
```


## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
`Abstract` | boolean | Whether cluster definition is purely for child reference.
`Autoscale` | boolean | Enable auto-start and stop on nodearrays
`Category`| String | Which category to display the cluster icon
`CategoryOrder` | Integer | Install to a directory other than /opt/cycle_server
`FormLayout`    | String  | SectionPanel for multi-panel display of parameters
`IconUrl`  | URL | link to representative icon for cluster displayed in UI
`MaxCount` | Integer | To ensure that the cluster never exceeds 10 nodes you would specify a value of 10. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
`MaxCoreCount` | Integer | To ensure that the cluster never exceeds 100 cores you would specify a value of 100. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
`ParentName` | String | Assume properties of abstract parent cluster in the same cluster template file unless local override.

_None of the cluster attributes are required_

## Subordinate Objects

The cluster object has either `[[node]]` or `[[nodearray]]` as subordinate objects.

