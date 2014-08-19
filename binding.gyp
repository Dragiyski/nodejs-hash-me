{
	"targets": [
		{
			"target_name": "native",
			"include_dirs": [
				"<(node_root_dir)/deps/v8/src"
			],
			"sources": [
				"src/ObjectHash.cxx"
			]
		}
	]
}
