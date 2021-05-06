

namespace OutlookEmailToParquet
{
    public class MailColumnInt : MailColumnTyped<int>
    {
        public MailColumnInt(string name) : base(name)
        {
        }


        public override Parquet.Data.DataColumn ToParquetColumn()
        {
            var col_x = new Parquet.Data.DataColumn(new Parquet.Data.DataField<int>(this.Name), this.ToSystemArray());
            return col_x;
        }
    }
}
