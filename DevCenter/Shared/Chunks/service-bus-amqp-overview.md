# AMQP 1.0 support in Windows Azure Service Bus


>New AMQP 1.0 support in Service Bus allows you to build cross-platform, hybrid applications using an open standard protocol. Applications can be constructed using components built using different languages and frameworks and running on different operating systems. All these components can connect to Service Bus and seamlessly exchange structured business messages efficiently and at full-fidelity.

## Introduction: What is AMQP 1.0 and why is it important?

Traditionally message-oriented middleware products have used proprietary protocols for communication between client applications and brokers. This means that once you’ve selected a particular vendor’s messaging broker, you need to use that vendor’s libraries to connect your client applications to it. This results in a degree of lock-in to that vendor since porting an application to a different product will require re-coding of all the connected applications. 

Furthermore, connecting messaging brokers from different vendors is a tricky proposition and typically requires application-level bridging to move messages from one system to another, and to translate between their proprietary message formats. This is a surprisingly common requirement, for example, when providing a new unified interface to older disparate systems, or integrating IT systems following a merger.

Finally, as we all know, the software industry is a fast-moving business; new programming languages and application frameworks are invented at a sometimes bewildering pace. Similarly the requirements of IT systems evolve over time and developers want to take advantage of the latest languages and frameworks. But what if your selected messaging vendor isn’t supporting these platforms? Since the protocols are proprietary, it’s not possible for others to provide libraries for these new platforms, and so you’re restricted to building gateways, bridges and other inelegant approaches.

The development of AMQP (Advanced Message Queuing Protocol) 1.0 was motivated by these issues. It originated at JP Morgan Chase, who, like most financial services firms, are heavy users of message-oriented middleware. The goal was simple, to create an open standard messaging protocol that would make it possible to build message-based applications using components built using different languages, frameworks,  and operating systems, all using best-of-breed components from a range of suppliers.

## AMQP 1.0 technical features

AMQP 1.0 is an efficient, reliable, wire-level messaging protocol that can be used to build robust, cross-platform, messaging applications. The protocol has a simple goal, namely to define the mechanics of securely, reliably and efficiently transferring messages between two parties. The messages themselves are encoded using a portable data representation that allows heterogeneous senders and receivers to exchange structured business messages at full-fidelity. Here is a summary of the most important features:

*    **Efficient**: AMQP 1.0 is a connection-oriented protocol that uses a binary encoding for the protocol instructions and the business messages transferred over it. It incorporates sophisticated flow-control schemes to maximize the utilization of the network and the connected components. That said, the protocol was designed to strike a balance between efficiency, flexibility and interoperability.
*    **Reliable**: The AMQP 1.0 protocol allows messages to be exchanged with a range of reliability guarantees, from fire-and-forget to reliable, exactly-once acknowledged delivery.
*    **Flexible**: AMQP 1.0 is a flexible protocol that can be used to support different topologies. The same protocol can be used for client-to-client, client-to-broker, and broker-to-broker communications.
*    **Broker-model independent**: The AMQP 1.0 specification does not make any requirements on the messaging model used by a broker. This means that it’s possible to easily add AMQP 1.0 support to existing messaging brokers.

## AMQP 1.0 is a Standard (with a capital ‘S’)

AMQP 1.0 has been in development since 2008 by a core group of 20+ companies, both technology suppliers and end-user firms. During that time, user firms have contributed their real-world business requirements and the technology vendors have evolved the protocol to meet them. Throughout the process, vendors have participated in _connect-a-thon_ workshops where they’ve collaborated to validate interoperability between their implementations.

In October 2011, the development work was transitioned to a Technical Committee within the Organization for the Advancement of Structured Information Standards (OASIS) and the OASIS AMQP 1.0 Standard was released in October 2012. The following firms participated in the Technical Committee during the development of the Standard:

*    **Technology vendors**: Axway Software, Huawei Technologies, IIT Software, INETCO Systems, Kaazing, Microsoft, Mitre Corporation, Primeton Technologies, Progress Software, Red Hat, SITA, Software AG, Solace Systems, VMware, WSO2, Zenika.
*    **User firms**: Bank of America, Credit Suisse, Deutsche Boerse, Goldman Sachs, JPMorgan Chase.

Some of the commonly cited benefits of open standards include:

*    Less chance of vendor lock-in
*    Interoperability
*    Broad availability of libraries and tooling
*    Protection against obsolescence
*    Availability of knowledgeable staff
*    Lower and manageable risk

## AMQP 1.0 and Service Bus

AMQP 1.0 support was added to Windows Azure Service Bus as a preview feature in October 2012. It is expected to transition to General Availability (GA) in the first half of 2013.

The addition of AMQP 1.0 means that it’s now possible to leverage the queuing and publish/subscribe brokered messaging features of Service Bus from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks and operating systems.

The diagram below illustrates an example deployment where Java clients running on Linux, written using the standard Java Message Service (JMS) API, and .NET clients running on Windows, are exchanging messages via Service Bus using AMQP 1.0.

![][0]

**Figure 1: Example deployment scenario showing cross-platform messaging using Service Bus and AMQP 1.0**

At this time the following client libraries are known to work with Service Bus:

<table>
  <tr>
    <th>Language</th>
    <th>Library</th>
  </tr>
  <tr>
    <td>Java</td>
    <td>Apache Qpid Java Message Service (JMS) client<br/>
        IIT Software SwiftMQ Java client</td>
  </tr>
  <tr>
    <td>C</td>
    <td>Apache Qpid Proton-C</td>
  </tr>
  <tr>
    <td>PHP</td>
    <td>Apache Qpid Proton-PHP</td>
  </tr>
  <tr>
    <td>Python</td>
    <td>Apache Qpid Proton-Python</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
  </tr>
</table>


**Figure 2: Table of AMQP 1.0 client libraries**

The Developer Guide accompanying the preview release provides information about how to obtain and use these libraries with Service Bus. See the References section below for further information.

## Summary

*    AMQP 1.0 is an open reliable messaging protocol that can be used to build cross-platform, hybrid applications. AMQP 1.0 is an OASIS Standard.
*    Service Bus support for AMQP 1.0 is available now as a preview feature with general availability expected during H1 2013. Pricing is the same as for the existing protocols.

## References

*    [OASIS Advanced Message Queuing Protocol (AMQP) Version 1.0](http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf)
*    [How to use the Java Message Service (JMS) API with Service Bus & AMQP 1.0](http://aka.ms/ll1fm3)
*    [How to use AMQP 1.0 with the .NET Service Bus .NET API](http://aka.ms/lym3vk)
*    [Service Bus AMQP Preview Developers Guide (included in the Service Bus AMQP Preview NuGet package)](http://aka.ms/tnwtu4)

[0]: ../Media/Example1.png

