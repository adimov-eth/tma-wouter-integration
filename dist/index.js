import { useCallback as g, useState as N, useMemo as P, useEffect as S } from "react";
class d extends Error {
  constructor(e, o, p) {
    super(o, { cause: p }), this.type = e, Object.setPrototypeOf(this, d.prototype);
  }
}
function y(t, e, o) {
  return new d(t, e, o);
}
const U = "ERR_UNEXPECTED_TYPE", w = "ERR_PARSE";
function h() {
  return y(U, "Value has unexpected type");
}
class $ {
  constructor(e, o, p) {
    this.parser = e, this.isOptional = o, this.type = p;
  }
  /**
   * Attempts to parse passed value
   * @param value - value to parse.
   * @throws {SDKError} ERR_PARSE
   * @see ERR_PARSE
   */
  parse(e) {
    if (!(this.isOptional && e === void 0))
      try {
        return this.parser(e);
      } catch (o) {
        throw y(
          w,
          `Unable to parse value${this.type ? ` as ${this.type}` : ""}`,
          o
        );
      }
  }
  optional() {
    return this.isOptional = !0, this;
  }
}
function _(t, e) {
  return () => new $(t, !1, e);
}
const s = _((t) => {
  if (typeof t == "boolean")
    return t;
  const e = String(t);
  if (e === "1" || e === "true")
    return !0;
  if (e === "0" || e === "false")
    return !1;
  throw h();
}, "boolean");
function O(t, e) {
  const o = {};
  for (const p in t) {
    const a = t[p];
    if (!a)
      continue;
    let c, n;
    if (typeof a == "function" || "parse" in a)
      c = p, n = typeof a == "function" ? a : a.parse.bind(a);
    else {
      const { type: r } = a;
      c = a.from || p, n = typeof r == "function" ? r : r.parse.bind(r);
    }
    try {
      const r = n(e(c));
      r !== void 0 && (o[p] = r);
    } catch (r) {
      throw y(w, `Unable to parse field "${p}"`, r);
    }
  }
  return o;
}
function R(t) {
  let e = t;
  if (typeof e == "string" && (e = JSON.parse(e)), typeof e != "object" || e === null || Array.isArray(e))
    throw h();
  return e;
}
function u(t, e) {
  return new $((o) => {
    const p = R(o);
    return O(t, (a) => p[a]);
  }, !1, e);
}
const l = _((t) => {
  if (typeof t == "number")
    return t;
  if (typeof t == "string") {
    const e = Number(t);
    if (!Number.isNaN(e))
      return e;
  }
  throw h();
}, "number"), i = _((t) => {
  if (typeof t == "string" || typeof t == "number")
    return t.toString();
  throw h();
}, "string");
u({
  req_id: i(),
  data: (t) => t === null ? t : i().optional().parse(t)
}), u({
  req_id: i(),
  result: (t) => t,
  error: i().optional()
}), u({
  height: l(),
  width: (t) => t == null ? window.innerWidth : l().parse(t),
  is_state_stable: s(),
  is_expanded: s()
});
u({
  id: l(),
  type: i(),
  title: i(),
  photoUrl: {
    type: i().optional(),
    from: "photo_url"
  },
  username: i().optional()
}, "Chat").optional();
u({
  addedToAttachmentMenu: {
    type: s().optional(),
    from: "added_to_attachment_menu"
  },
  allowsWriteToPm: {
    type: s().optional(),
    from: "allows_write_to_pm"
  },
  firstName: {
    type: i(),
    from: "first_name"
  },
  id: l(),
  isBot: {
    type: s().optional(),
    from: "is_bot"
  },
  isPremium: {
    type: s().optional(),
    from: "is_premium"
  },
  languageCode: {
    type: i().optional(),
    from: "language_code"
  },
  lastName: {
    type: i().optional(),
    from: "last_name"
  },
  photoUrl: {
    type: i().optional(),
    from: "photo_url"
  },
  username: i().optional()
}, "User").optional();
function b(t, e) {
  return t.startsWith(e) ? t : `${e}${t}`;
}
function E(t) {
  return new URL(
    typeof t == "string" ? t : `${t.pathname || ""}${b(t.search || "", "?")}${b(t.hash || "", "#")}`,
    "http://a"
  );
}
function m(t) {
  const e = typeof t == "string" ? t.startsWith("/") : !!(t.pathname && t.pathname.startsWith("/")), o = E(t);
  return `${e ? o.pathname : o.pathname.slice(1)}${o.search}${o.hash}`;
}
function W(t) {
  const e = g(() => ({
    pathname: t.pathname,
    search: t.search,
    hash: t.hash,
    state: t.state,
    key: t.id
  }), [t]), [o, p] = N(e), a = g((n, r) => {
    const f = typeof n == "string" ? n : m(n);
    if (!f) {
      console.error("Invalid path provided to navigate");
      return;
    }
    r != null && r.replace ? t.replace(f, r.state) : t.push(f, r == null ? void 0 : r.state);
  }, [t]), c = P(() => ({
    go: (n) => t.go(n),
    push: (n, r) => a(n, { state: r }),
    replace: (n, r) => a(n, { replace: !0, state: r }),
    createHref: (n) => t.renderPath(m(n)),
    encodeLocation: (n) => E(t.renderPath(m(n))).toString()
  }), [t, a]);
  return S(() => t.on("change", () => p(e())), [t, e]), [o, c];
}
export {
  W as useIntegration
};
//# sourceMappingURL=index.js.map
