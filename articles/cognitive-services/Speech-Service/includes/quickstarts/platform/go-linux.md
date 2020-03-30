[!INCLUDE [linux-common](linux-common.md)]

## Configure Go environment

1. Since the bindings rely on `cgo`, you need to set the environment variables so Go can find the SDK:

   ```sh
   export CGO_CFLAGS="-I$SPEECHSDK_ROOT/include/c_api"
   export CGO_LDFLAGS="-L$SPEECHSDK_ROOT/lib -lMicrosoft.CognitiveServices.Speech.core"
   ```

1. Additionally, to run applications including the SDK, we need to tell the OS
where to find the libs:

   ```sh
   export LD_LIBRARY_PATH="$SPEECHSDK_ROOT/lib/<arch>:$LD_LIBRARY_PATH"
   ```

## Next steps

[!INCLUDE [windows](../quickstart-list-go.md)]