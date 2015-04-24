
<properties
   pageTitle="Azure Service Fabric Actors for Internet of Things"
   description="Azure Service Fabric Actors is the key building block (as a middle-tier) in a system that combines a messaging system front end that supports multiple transports such as HTTPS, MQTT or AMQP then communicates with actors that represent individual devices."
   services="service-fabric"
   documentationCenter=".net"
   authors="jessebenson"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/01/2015"
   ms.author="claudioc"/>

# Service Fabric Actors design pattern: Internet of Things
Since IoT became the new trend alongside the technological advancement in both devices and cloud services, developers started looking at key building blocks to develop their systems on.
The following diagram illustrates the key scenarios achieved using Azure Service Fabric Actors:

![][1]

Azure Service Fabric Actors is the key building block (as a middle-tier) in a system that combines a messaging system front end that supports multiple transports such as HTTPS, MQTT or AMQP then communicates with actors that represent individual devices. Because the actors can maintain state, modelling streams—especially stateful stream processing—and aggregation per device is straightforward. If the data must be persisted, then we can also easily flush on demand or on a timer while still easily maintaining the latest N bits of data in another variable for quick querying.
Note that in our samples, we deliberately omitted the details of the event/messaging tier, which will allow actors to communicate with devices, to keep the focus on the actor model.
There are essentially two scenarios usually composed together:

* *Collecting telemetry and state data from a single or a set of devices and maintaining their state*. Think about tens of thousands of mouse traps (yes, this is a real customer scenario) sending data, as basic as whether the device trapped a nasty pest inside or not. Data is aggregated by region, and with enough mice trapped in one region, an engineer is dispatched to clean up the devices. A mouse-trap as an actor? Absolutely. A group actor per region as the aggregator? You bet.

* *Pushing device behavior and configuration to a single or set of devices*. Think about home solar power devices where the vendor pushes different configurations based on consumption patterns and seasonality.

## Telemetry data and device grouping

First let’s have a look at the case where devices, think tens of thousands, are grouped together and are all sending telemetry data to their associated group. In the following example, the customer has deployed devices to each region.
When the device is switched on, the first thing it does is send an ActivateMe message with relevant information such as location, version, and so on. In turn, the actor associated with the device (through the Device Id) sets up the initial state for the device, such as saving state locally (could have been persisted also) and registering a group actor. In this case, we assign a random group for our simulation.

As part of the initialization process, we can configure the device by retrieving configuration data from a group actor or some other agent. This way the devices can initially be pretty dumb and get their "smarts" upon initialization. Once this is done, the device and the actor are ready to send and process telemetry data.

All the devices periodically send their telemetry information to the corresponding actor. If the actor is already activated then the same actor will be used. Otherwise it will be activated. At this point it can recover state from a stable store if required. When the actor receives telemetry information it stores it to a local variable. We are doing this to simplify the sample. In a real implementation we would probably save it to an external store to allow operations to monitor and diagnose device health and performance. Finally, we push telemetry data to the group actor that the device actor logically belongs to.

## IoT code sample – Telemetry

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

public class Thing : Actor<ThingState>, IThing
{

    public override Task OnActivateAsync()
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
        return TaskDone.Done;
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

At the group level, as per our sample, our goal is to monitor the devices in the group and aggregate telemetry data to produce alerts for engineers. In this case, our customer would like to send engineers to specific regions where there are a certain number of fault devices. Of course our customer would like to reduce costs by minimizing engineering time spent on the road. For this reason, each group actor maintains an aggregated state of faulty devices per region. When this number hits a threshold, our customer dispatches an engineer to the region to replace/repair these devices.
Let’s have a look how it is done:

## IoT code sample – grouping and aggregation

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

public class ThingGroup : Actor<ThingGroupState>, IThingGroup
{

    public override Task OnActivateAsync()
    {
        State._devices = new List<ThingInfo>();
        State._faultsPerRegion = new Dictionary<string, int>();
        State._faultyDevices = new List<ThingInfo>();

        return base.OnActivateAsync();
    }

    public Task RegisterDevice(ThingInfo deviceInfo)
    {
        State._devices.Add(deviceInfo);
        return TaskDone.Done;
    }

    public Task UnregisterDevice(ThingInfo deviceInfo)
    {
        State._devices.Remove(deviceInfo);
        return TaskDone.Done;
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

        return TaskDone.Done;
    }
}
```

As we can see it is pretty straight forward. After running simple tests, the output looks like this:

```
Sending an engineer to repair/replace devices in Richmond
    Device = 33 Region = Richmond Version = 4
    Device = 79 Region = Richmond Version = 5
    Device = 89 Region = Richmond Version = 3
    Device = 63 Region = Richmond Version = 2
    Device = 85 Region = Richmond Version = 4
```

By the way, you may think it would have been better if devices were grouped by region. Of course, it's entirely up to us in terms of how to group/partition devices—whether it is geo-location, device type, version, tenant, and so on.
There is a point of caution here: Device State vs. Reporting/Analysis. This is why we made the pattern illustration explicit. We must avoid fan-out queries to actors to build reporting actors; unnecessary instantiations and performance are just to name two drawbacks. We recommend two approaches for reporting:

* Use group level actor, such as an aggregator, to maintain a view for the group. Let each actor push only relevant data proactively to this actor. Then this group level actor can be used to view the status of the devices in the group.

* Maintain an explicit store that is designed for reporting. An aggregator can buffer and periodically push data to a reporting store for further querying and analysis.

## Device operation
So far so good, but how about operations on these devices? Like for devices, actors can expose operational interfaces so an administrator can carry out operations on devices. For example, an administrator wants to push a new configuration to a group of home solar energy devices (yep, another real life scenario) based on seasonal/regional changes.

The key idea here is we have granular control over each device using “Thing” actors as well as group operations using “ThingGroup” actors —whether it is aggregating data coming in from devices such as telemetry or sending data such as configuration to large number of devices. The platform takes care of distribution of the device actors and messaging between them, which is totally transparent to the developer.

When it comes to machine to machine (M2M) communications, both the Hub and Spoke pattern we discussed in the distributed networks and graphs section or direct actor-to-actor interaction works well. For M2M scenarios, we could model a “Directory/Index” actor for a group of devices allowing them to discover and send messages to each other as illustrated below:

![][2]

Azure Service Fabric Actors also takes care of the lifetime of the Actors. Think of it this way, we will have always-on devices and we will have occasionally-connected devices. Why would we keep the actor that looks after the device that connects every 14 hours in memory? Azure Service Fabric allow save and restore of device state when we want it and where we want it.

We conclude that more and more customers will look at Azure Service Fabric Actors as a key building block for their IoT implementations.

## Next Steps
[Pattern: Smart Cache](service-fabric-reliable-actors-pattern-smartcache.md)

[Pattern: Distributed Networks and Graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource Governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful Service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Distributed Computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors/internet-of-things-1.png
[2]: ./media/service-fabric-reliable-actors/internet-of-things-2.png
