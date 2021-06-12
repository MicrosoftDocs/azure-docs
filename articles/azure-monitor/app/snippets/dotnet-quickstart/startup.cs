public void ConfigureServices(IServiceCollection services)
{
    services.AddRazorPages();
    services.AddApplicationInsightsTelemetry();
}