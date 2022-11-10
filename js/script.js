!function() {
  "use strict";
  let e, t, n, o, i, r, a, d, E, l = new THREE.Group(), s = new THREE.Group(), c = 3, w = 1, m = "";
  function h() {
      let e = this.attributes.position;
      if (null != this.index) return;
      let t = e.count / 3, n = [], o = new THREE.Triangle(), i = new THREE.Vector3(), r = new THREE.Vector3(), a = new THREE.Vector3();
      for (let d = 0; d < t; d++) {
          i.fromBufferAttribute(e, 3 * d + 0), r.fromBufferAttribute(e, 3 * d + 1), a.fromBufferAttribute(e, 3 * d + 2), 
          o.set(i, r, a);
          let t = new THREE.Vector3();
          o.getMidpoint(t);
          let E = i.distanceTo(r), l = Math.sqrt(3) / 2 * E * .33, s = t.clone().normalize().setLength(l);
          t.add(s), n.push(t.clone(), i.clone(), r.clone(), t.clone(), r.clone(), a.clone(), t.clone(), a.clone(), i.clone());
      }
      let d = new THREE.BufferGeometry().setFromPoints(n);
      return d.computeVertexNormals(), d;
  }
  function u(e, t, n, o = "") {
      i = new THREE.IcosahedronGeometry(t, n);
      let r = [];
      for (let e = 0; e < i.attributes.position.count; e++) {
          let t = new THREE.Vector3();
          t.fromBufferAttribute(i.getAttribute("position"), e), r.push([ t.x, t.y, t.z ]);
      }
      r = [ ...new Set(r.map(JSON.stringify)) ].map(JSON.parse);
      for (let t = 0; t < r.length; t++) {
          let n = new THREE.Vector3(r[t][0], r[t][1], r[t][2]);
          (a = d.clone()).position.set(n.x, n.y, n.z), "random" == o ? (a.material = d.material.clone(), 
          a.material.color.set(new THREE.Color(16777215 * Math.random()))) : o && (a.material = d.material.clone(), 
          a.material.color.set(new THREE.Color(o))), a.castShadow = !0, a.receiveShadow = !0, 
          e.add(a);
      }
  }
  function R() {
      e.aspect = window.innerWidth / window.innerHeight, e.updateProjectionMatrix(), n.setSize(window.innerWidth, window.innerHeight);
  }
  function p() {
      requestAnimationFrame(p), o.update(), s.rotation.x += .003, s.rotation.y -= .005, 
      s.rotation.z -= .002, l.rotation.x -= .002, l.rotation.y -= .005, l.rotation.z += .001, 
      n.render(t, e);
  }
  !function() {
      const H = document.createElement("div");
      document.body.appendChild(H), (t = new THREE.Scene()).background = 0, (n = new THREE.WebGLRenderer({
          antialias: !0
      })).setPixelRatio(window.devicePixelRatio), n.setSize(window.innerWidth, window.innerHeight), 
      n.outputEncoding = THREE.sRGBEncoding, n.shadowMap.enabled = !0, H.appendChild(n.domElement), 
      new THREE.RGBELoader().load("https://happy358.github.io/Images/HDR/leadenhall_market_1k.hdr", function(e) {
          e.mapping = THREE.EquirectangularReflectionMapping, e.flipY = !1, t.environment = e;
      }), (e = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .01, 500)).position.set(0, 3.5, 13), 
      e.lookAt(0, 0, 0), (o = new THREE.OrbitControls(e, n.domElement)).autoRotate = !0, 
      o.autoRotateSpeed = 2, o.enableDamping = !0, o.enablePan = !1, o.minDistance = 3, 
      o.maxDistance = 20, o.minPolarAngle = 0, o.maxPolarAngle = Math.PI / 2, o.target.set(0, 0, 0), 
      o.update();
      const T = new THREE.AmbientLight(16777215, .8);
      t.add(T), THREE.BufferGeometry.prototype.tripleFace = h, i = new THREE.IcosahedronGeometry(c, w).tripleFace(), 
      r = new THREE.MeshStandardMaterial({
          color: 15658734,
          metalness: 1,
          roughness: .1
      }), (a = new THREE.Mesh(i, r)).castShadow = !0, a.receiveShadow = !0, s.add(a);
      let f = new THREE.PointLight(15658734, 1.3, 20);
      f.castShadow = !0, f.shadow.bias = -(c + .5), s.add(f), t.add(s), E = .2, i = new THREE.IcosahedronGeometry(E, 0), 
      d = new THREE.Mesh(i, r), u(s, c, w, m = "random"), t.add(l), E = .15, i = new THREE.SphereGeometry(E, 20, 20), 
      d = new THREE.Mesh(i, r), u(l, c = 5, w = 3, m = "random"), i = new THREE.BoxGeometry(50, 50, 50), 
      r = new THREE.MeshPhongMaterial({
          color: 1118481,
          shininess: 10,
          specular: 1118481,
          side: THREE.BackSide
      }), (a = new THREE.Mesh(i, r)).position.y = 19.2, a.receiveShadow = !0, t.add(a), 
      p(), window.addEventListener("resize", R);
  }();
}();