// for high level use cases and scenarios and diagrams

## WIP TO DO NOT EDIT

# Common Use Cases

# Multiparty Computing
Multi

ACC VM which enabled Intel SGX hardware support 

For data processing servers, it must be ACC VM. 

For the client side, it could be any machine. 

OE SDK for server, ref: https://github.com/openenclave/openenclave 

OE HostVerify SDK for client, current: open-enclave-hostverify_0.7.x_amd64.deb 

Azure DCAP Client for both 

Data in use 

We have ACC VM to enable hardware trusted execution environment (TEE) support. 

We have OE SDK to create secured enclave within the ACC VM. 

Within the enclave we ensure the data will not be exposed to any one even the VM provider, since the data inside of the enclave will be encrypted by hardware support. 

Data in transit 

Using attested TLS as secured channel to guarantee the security of data in transit. 

On the client side, use OE HostVerify SDK to make sure the data is only sent to the same server which is protected by the enclave. 

The client machine can be any machine, i.e. GCP VM, AWS VM, On prem machine. 

Data in the file 

Protected by customers, not in ACC's scope now. 

## Anti Money Laundering
## Fraud Detection
## Algorithms

# Confidential Machine Learning (Inferencing)

//add a learn more

# Blockchain
>> Add CCF link
>> Add diagram that shows compute happening
>> Show diagram similar to secret network or CCF

# # Confidential containers 

##Key management with attetation? 
