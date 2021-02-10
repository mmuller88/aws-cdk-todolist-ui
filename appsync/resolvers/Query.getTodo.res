#if( $ctx.result.statusCode == 200 )
  #if( $ctx.result.headers.get("Content-Type").toLowerCase().contains("xml") )
$utils.xml.toJsonString($ctx.result.body)
  #else
$ctx.result.body
  #end
#else
$util.qr($util.appendError($ctx.result.body, $ctx.result.statusCode))
#end