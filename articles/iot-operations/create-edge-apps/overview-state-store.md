# What is the state store

The state store is a distributed storage system within the Azure IoT Operations cluster. Using the State Store, applications can get/set/delete key/value pairs without needing to install additional services such as Redis. The State Store also provides versioning of the data as well as providing the primitives for building distributed locks.

Like Redis, the state store uses in memory storage. Stopping the Kubernetes cluster and/or uninstalling MQ will state store data to be lost.

The state store is implemented via MQTTv5. Its service is integrated directly into MQ and is automatically started when MQ starts. The state store provides the same high available as the MQ MQTT broker.

The state store extends MQTT broker's authorization mechanism, allowing individual clients to have optional read and write access to specific keys. Its authentication is documented in more detail here.

The state store protocol is documented in [state store protocol](concept-about-state-store-protocol.md). SDKs are available for the state store for Go, C#, and Rust. You are strongly encouraged to use an SDK if available for your language instead of implementing the protocol yourself. Additional information about the SDKs is available

## CLI

Ewerton tool goes here.
