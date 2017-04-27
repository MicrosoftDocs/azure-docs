## Build the gateway

This tutorial uses custom gateway modules to communicate with the remote monitoring preconfigured solution. Therefore, you need to build the gateway from the custom source code. The following sections describe how to download and build the custom gateway.

To build the gateway on the Intel NUC, you need to:

- Clone the repository that contains the gateway source code.
- Set up the C compiler to work with the Gateway SDK.
- Install the necessary tools for the build process.
- Build the gateway and samples.

### Clone the repository

To clone the gateway repository source code to the Intel NUC, enter the following commands in the shell:

```bash
cd /tmp
git clone https://github.com/IoTChinaTeam/azure-remote-monitoring-gateway-intelnuc.git
cd azure-remote-monitoring-gateway-intelnuc
git submodule update --init --recursive
```

### Configure the environment

The Intel NUC uses a specific package loader for shared libraries and uses this specific path in the CMake scripts. This work around is necessary to resolve a build error on the Intel NUC. Enter the following commands in the shell on the Intel NUC:

```bash
export LIB64_PATH=/iotdk2/scott/Projects/iot-cloud/build-intel-baytrail-64-wrlinux-7-0013/bitbake_build/tmp/sysroots/intel-baytrail-64/usr
mkdir -p $LIB64_PATH
ln -s /usr/lib64 $LIB64_PATH/lib64
```

### Install CMake

The build scripts for the gateway use the CMake utility. Enter the following commands in the shell on the Intel NUC to install CMake:


```bash
cd /tmp
wget https://cmake.org/files/v3.8/cmake-3.8.0-Linux-x86_64.tar.gz
tar -xvf cmake-3.8.0-Linux-x86_64.tar.gz
export PATH=$PATH:/tmp/cmake-3.8.0-Linux-x86_64/bin
```

### Build the gateway

To build the gateway, enter the following commands in the shell on the Intel NUC:

```bash
cd /tmp/azure-remote-monitoring-gateway-intelnuc
./tools/build.sh
```

The build script generates the following executable: **/tmp/azure-remote-monitoring-gateway-intelnuc/build/samples/simulated\_device\_cloud\_upload/simulated\_device\_cloud\_upload\_sample**.