
Vue.component('plugin-vr-objects', {
  props: ['db', 'connected', 'url'],

  methods: {
    find_member_for_tag(type, tag) {
      for (var i = 0; i < type.headers.length; i ++) {
        var m = type.headers[i];
        if (m.tags) {
          for (var t = 0; t < m.tags.length; t ++) {
            if (m.tags[t] == tag) {
                return m;
            }
          }
        }
      }
      return undefined;
    },

    view_from_tags(type, tag_model) {
      var result = undefined;
      for (var k in tag_model) {
        var member = this.find_member_for_tag(type, tag_model[k]);
        if (member) {
            if (result == undefined) {
              result = {}
            }
            result[k] = member.index;
        }
      }
      return result;
    },

    set_value(value, default_value) {
      if (value != undefined) {
        return value;
      } else {
        return default_value;
      }
    }
  },

  render(h) {
    var objects = [];

    for (var t = 0; t < db.length; t ++) {
      var type = db[t];

      if (type.objects) {
        var tag_view = this.view_from_tags(type, {
            x: "position/x",
            y: "position/y",
            z: "position/z",
            size: "size",
            shape: "shape",
            color: "color"
        });

        if (tag_view != undefined) {
          for (var o = 0; o < type.objects.length; o ++) {
            var object = type.objects[o];
            var x = this.set_value(object.getMember(tag_view.x), 0);
            var y = this.set_value(object.getMember(tag_view.y), 0);
            var z = this.set_value(object.getMember(tag_view.z), -3);
            var size = this.set_value(object.getMember(tag_view.size), 1);
            var shape = this.set_value(object.getMember(tag_view.shape), "box");
            var color = this.set_value(object.getMember(tag_view.color), "#00C4A3");

            if (shape == "square") {
                shape = "box";
            } else if (shape == "circle") {
                shape = "sphere";
            } else if (shape == "triangle") {
                shape = "tetrahedron";
            }

            objects.push(h(
              'a-' + shape,
              {
                attrs: {
                    position: "" + x + " " + y + " " + z,
                    scale: "" + size + " " + size + " " + size,
                    color: color,
                    shadow: "cast: true; receive: false"
                }
              }
            ));
          }
        }
      }
    }

    // Hack to make the Vue component return a single parent object
    return h(
      'a-box', {attrs:{"data-refresh": this.db.length, material:"transparency: true; opacity: 0"}}, objects
    );
  }
});

Vue.component('plugin-vr', {
  props: ['db', 'connected', 'url'],
  template: `
    <div :data-refresh="db.length">
        <a-scene>
            <plugin-vr-objects
              :db="db"
              :connected="connected"
              :url="url">
            </plugin-vr-objects>
            <a-plane shadow="receive:true" position="0 0 -4" rotation="-90 0 0" width="20" height="20" color="#282c34" static-body></a-plane>
            <a-sky color="#191c20"></a-sky>
        </a-scene>
    </div>
  `
});

app.plugin_loaded("vr", function() {
    /* Include aframe JS once */
    var el = document.createElement("script");
    el.setAttribute("type", "text/javascript");
    el.setAttribute("src", "https://aframe.io/releases/0.7.0/aframe.min.js");
    document.head.appendChild(el);
});
