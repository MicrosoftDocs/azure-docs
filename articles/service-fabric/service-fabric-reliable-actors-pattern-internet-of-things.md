
<properties
   pageTitle="Reliable Actors for Internet of Things | Microsoft Azure"
   description="Service Fabric Reliable Actors is the key building block in a system that combines a messaging system front end that supports multiple transports, such as HTTPS, MQTT, and AMQP."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/14/2015"
   ms.author="vturecek"/>

# Reliable Actors design pattern: Internet of Things
Since the Internet of Things (IoT) has become the new trend alongside the technological advancement in both devices and cloud services, developers have started looking at key building blocks for developing their systems. The following diagram illustrates the key scenarios achieved by using Azure Service Fabric Reliable Actors:

![Service Fabric Reliable Actors key scenarios][1]

Service Fabric Reliable Actors are the key building blocks (as a middle tier) in a system that combines a messaging system front end that supports multiple transports, such as HTTPS, MQTT, and AMQP, and communication with Actors that represent individual devices. Because Actors can maintain state, modeling streams--especially stateful stream processing--and aggregation per device is straightforward. If the data must be persisted, you can also easily flush on demand or on a timer. This can occur while you still maintain the latest N bits of data in another variable for quick querying.

Note that to keep the focus on the Actor model in our examples, we have deliberately omitted details of the event/messaging tier, which allows Actors to communicate with devices. There are essentially two scenarios, and they are usually composed together:

* **Collect telemetry and state data from a single device or set of devices and maintain their state**. Think about tens of thousands of mousetraps (this is a real customer scenario) sending data. This data is as basic as whether or not the device has trapped a pest inside. Such data is aggregated by region, and when enough mice are trapped in one region, an engineer is dispatched to clean up the devices. A mousetrap as an Actor? Yes. A group Actor per region as the aggregator? Absolutely.

* **Push device behavior and configuration to a single device or set of devices**. Think about home solar-power devices, where the vendor pushes different configurations based on consumption patterns and seasonality.

## Telemetry data and device grouping

First, let’s have a look at a case where devices (think tens of thousands) are grouped together, and they are all sending telemetry data to their associated group. In the following example, the customer has deployed devices to each region. When a device is switched on, the first thing it does is send an **ActivateMe** message with relevant information that includes location and version. The Actor associated with the device (through the device ID) sets up the initial state for the device, such as saving state locally (this can also be persisted), and registering a group Actor. In this case, we have assigned a random group for our simulation.

As part of the initialization process, we can configure the device by retrieving configuration data from a group Actor or some other agent. This way, the devices can initially be pretty "dumb" and get their "smarts" on initialization. Once this is done, the device and Actor are ready to send and process telemetry data.

All of the devices periodically send their telemetry information to their corresponding Actors. If an Actor is already activated, then the same Actor will be used. If not, it will be activated. At this point, it can recover state from a stable store, if that's required. When the Actor receives telemetry information, it stores it to a local variable.

We are doing this to simplify the example. In a real implementation, we would probably save it to an external store. This would allow operations to monitor and diagnose device health and performance. Finally, we push telemetry data to the group Actor to which the device Actor logically belongs.

## IoT code sample: Telemetry

```csharp
public interface IThing : IActor
{
    Task ActivateMe(string region, int version);
    Task SendTelemetryAsync(ThingTelemetry telemetry);
}

[DataContract]
class ThingState
{
	[DataMember]
	public List<ThingTelemetry> _telemetry;
	[DataMember]
	public ThingInfo _deviceInfo;
	[DataMember]
	long _deviceGroupId;
}

public class Thing : StatefulActor<ThingState>, IThing
{

    protected override Task OnActivateAsync()
    {
        State._telemetry = new List<ThingTelemetry>();
        State._deviceGroupId = -1; // not activated
        return base.OnActivateAsync();
    }

    public Task SendTelemetryAsync(ThingTelemetry telemetry)
    {
        State._telemetry.Add(telemetry); // saving data at the device level
        if (State._deviceGroupId != -1)
        {
            var deviceGroup = ActorProxy.Create<IThingGroup>(State._deviceGroupId);
            return deviceGroup.SendTelemetryAsync(telemetry); // sending telemetry data for aggregation
        }
        return Task.FromResult(true);
    }

    public Task ActivateMe(string region, int version)
    {
        State._deviceInfo = new ThingInfo()
        {
            DeviceId = this.GetPrimaryKeyLong(),
            Region = region,
            Version = version
        };

        // based on the info, assign a group... for demonstration we are assigning a random group
        State._deviceGroupId = new Random().Next(10, 12);

        var deviceGroup = ActorProxy.Create<IThingGroup>(State._deviceGroupId);
        return deviceGroup.RegisterDevice(State._deviceInfo);
    }
}
```

At the group level, the goal in our example is to monitor the devices in the group and aggregate telemetry data to produce alerts for engineers. In this case, our customer would like to send engineers to the specific regions where a certain number of devices is faulty. Of course, our customer would also like to reduce costs by minimizing the engineering time spent on the road. For this reason, each group Actor maintains an aggregated state of faulty devices per region. When this number hits a threshold, our customer dispatches an engineer to the region to repair or replace the faulty devices.

Let’s have a look how it is done:

## IoT code sample: Grouping and aggregation

```csharp
public interface IThingGroup : IActor
{
    Task RegisterDevice(ThingInfo deviceInfo);
    Task UnregisterDevice(ThingInfo deviceInfo);
    Task SendTelemetryAsync(ThingTelemetry telemetry);
}

[DataContract]
class ThingGroupState
{
    [DataMember]
    public List<ThingInfo> _devices;
    [DataMember]
    public Dictionary<string, int> _faultsPerRegion;
    [DataMember]
    public List<ThingInfo> _faultyDevices;
}

public class ThingGroup : StatefulActor<ThingGroupState>, IThingGroup
{

    protected override Task OnActivateAsync()
    {
        State._devices = new List<ThingInfo>();
        State._faultsPerRegion = new Dictionary<string, int>();
        State._faultyDevices = new List<ThingInfo>();

        return base.OnActivateAsync();
    }

    public Task RegisterDevice(ThingInfo deviceInfo)
    {
        State._devices.Add(deviceInfo);
        return Task.FromResult(true);
    }

    public Task UnregisterDevice(ThingInfo deviceInfo)
    {
        State._devices.Remove(deviceInfo);
        return Task.FromResult(true);
    }

    public Task SendTelemetryAsync(ThingTelemetry telemetry)
    {
        if (telemetry.DevelopedFault)
        {
            if (false == _faultsPerRegion.ContainsKey(telemetry.Region))
            {
                State._faultsPerRegion[telemetry.Region] = 0;
            }
            State._faultsPerRegion[telemetry.Region]++;
            State._faultyDevices.Add(_devices.Where(d => d.DeviceId == telemetry.DeviceId).FirstOrDefault());

            if (State._faultsPerRegion[telemetry.Region] > _devices.Count(d => d.Region == telemetry.Region) / 3)
            {
                Console.WriteLine("Sending an engineer to repair/replace devices in {0}", telemetry.Region);
                foreach(var device in State._faultyDevices.Where(d => d.Region == telemetry.Region).ToList())
                {
                    Console.WriteLine("\t{0}", device);
                }
            }
        }

        return Task.FromResult(true);
    }
}
```

As you can see, it is relatively straightforward. After simple tests are run, the output looks like this:

```
Sending an engineer to repair/replace devices in Richmond
    Device = 33 Region = Richmond Version = 4
    Device = 79 Region = Richmond Version = 5
    Device = 89 Region = Richmond Version = 3
    Device = 63 Region = Richmond Version = 2
    Device = 85 Region = Richmond Version = 4
```

You may think that it would have been better if the devices were grouped by region. It's entirely up to you how you choose to group and/or partition devices, whether by geolocation, device type, version, tenant, or other criteria.

A point of caution here on device state versus reporting and analysis: You must avoid fan-out queries to Actors to build reporting Actors. This can cause unnecessary instantiations and performance issues, to name just two drawbacks. This is why we made the pattern illustration explicit. We recommend two approaches for reporting:

* Use a group level Actor, such as an aggregator, to maintain a view for the group. Let each Actor proactively push only relevant data to this Actor. The group-level Actor can be used to view the status of the devices in the group.

* Maintain an explicit store that is designed for reporting. An aggregator can buffer and periodically push data to a reporting store for further querying and analysis.

## Device operation
So far, so good. But what about operations on these devices? As with devices, Actors can expose operational interfaces so an administrator can carry out operations on devices. For example, consider an administrator who wants to push a new configuration to a group of home solar-energy devices (another real-life scenario) based on seasonal and regional changes.

The key idea here is to maintain granular control over each device by using “Thing” Actors, as well as control over group operations by using “ThingGroup” Actors. This is true whether you are aggregating data such as telemetry coming in from devices, or you are sending data such as configuration to a large number of devices. The platform takes care of the distribution of the device Actors, as well as the messaging between them. This remains totally transparent to the developer.

For machine-to-machine (M2M) communications, both the hub-and-spoke pattern we discussed in [the section on distributed networks and graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md) and direct Actor-to-Actor interaction work well. For M2M scenarios, you could model a “Directory/Index” Actor for a group of devices that would allow them to discover and send messages to each other, as illustrated below:

![Model of a Directory/Index Actor for a group of devices][2]

Service Fabric Actors also take care of the lifetimes of the Actors. Think of it this way: If you have always-on devices, as well as occasionally connected devices, why should you keep in memory an Actor that looks after a device that connects every 14 hours? Service Fabric allows you to save and restore the state of a device when you want it and where you want it.

More and more, customers will look to Service Fabric Reliable Actors as key building blocks for their IoT implementations.

## Next steps
[Pattern: Smart cache](service-fabric-reliable-actors-pattern-smart-cache.md)

[Pattern: Distributed networks and graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful service composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Distributed computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some antipatterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-pattern-internet-of-things/internet-of-things-1.png
[2]: ./media/service-fabric-reliable-actors-pattern-internet-of-things/internet-of-things-2.png
