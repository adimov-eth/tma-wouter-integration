import { useCallback as y, useState as $, useMemo as E, useEffect as N } from "react";
class g extends Error {
  constructor(e, a, s) {
    super(a, { cause: s }), this.type = e, Object.setPrototypeOf(this, g.prototype);
  }
}
function _(t, e, a) {
  return new g(t, e, a);
}
const U = "ERR_UNEXPECTED_TYPE", W = "ERR_PARSE";
function d() {
  return _(U, "Value has unexpected type");
}
class R {
  constructor(e, a, s) {
    this.parser = e, this.isOptional = a, this.type = s;
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
      } catch (a) {
        throw _(
          W,
          `Unable to parse value${this.type ? ` as ${this.type}` : ""}`,
          a
        );
      }
  }
  optional() {
    return this.isOptional = !0, this;
  }
}
function b(t, e) {
  return () => new R(t, !1, e);
}
const u = b((t) => {
  if (typeof t == "boolean")
    return t;
  const e = String(t);
  if (e === "1" || e === "true")
    return !0;
  if (e === "0" || e === "false")
    return !1;
  throw d();
}, "boolean");
function k(t, e) {
  const a = {};
  for (const s in t) {
    const o = t[s];
    if (!o)
      continue;
    let l, n;
    if (typeof o == "function" || "parse" in o)
      l = s, n = typeof o == "function" ? o : o.parse.bind(o);
    else {
      const { type: r } = o;
      l = o.from || s, n = typeof r == "function" ? r : r.parse.bind(r);
    }
    try {
      const r = n(e(l));
      r !== void 0 && (a[s] = r);
    } catch (r) {
      throw _(W, `Unable to parse field "${s}"`, r);
    }
  }
  return a;
}
function C(t) {
  let e = t;
  if (typeof e == "string" && (e = JSON.parse(e)), typeof e != "object" || e === null || Array.isArray(e))
    throw d();
  return e;
}
function p(t, e) {
  return new R((a) => {
    const s = C(a);
    return k(t, (o) => s[o]);
  }, !1, e);
}
const m = b((t) => {
  if (typeof t == "number")
    return t;
  if (typeof t == "string") {
    const e = Number(t);
    if (!Number.isNaN(e))
      return e;
  }
  throw d();
}, "number"), c = b((t) => {
  if (typeof t == "string" || typeof t == "number")
    return t.toString();
  throw d();
}, "string");
p({
  req_id: c(),
  data: (t) => t === null ? t : c().optional().parse(t)
}), p({
  req_id: c(),
  result: (t) => t,
  error: c().optional()
}), p({
  height: m(),
  width: (t) => t == null ? window.innerWidth : m().parse(t),
  is_state_stable: u(),
  is_expanded: u()
});
p({
  id: m(),
  type: c(),
  title: c(),
  photoUrl: {
    type: c().optional(),
    from: "photo_url"
  },
  username: c().optional()
}, "Chat").optional();
p({
  addedToAttachmentMenu: {
    type: u().optional(),
    from: "added_to_attachment_menu"
  },
  allowsWriteToPm: {
    type: u().optional(),
    from: "allows_write_to_pm"
  },
  firstName: {
    type: c(),
    from: "first_name"
  },
  id: m(),
  isBot: {
    type: u().optional(),
    from: "is_bot"
  },
  isPremium: {
    type: u().optional(),
    from: "is_premium"
  },
  languageCode: {
    type: c().optional(),
    from: "language_code"
  },
  lastName: {
    type: c().optional(),
    from: "last_name"
  },
  photoUrl: {
    type: c().optional(),
    from: "photo_url"
  },
  username: c().optional()
}, "User").optional();
function P(t, e) {
  return t.startsWith(e) ? t : `${e}${t}`;
}
function S(t) {
  return new URL(
    typeof t == "string" ? t : `${t.pathname || ""}${P(t.search || "", "?")}${P(t.hash || "", "#")}`,
    "http://a"
  );
}
function f(t) {
  const e = typeof t == "string" ? t.startsWith("/") : !!(t.pathname && t.pathname.startsWith("/")), a = S(t);
  return `${e ? a.pathname : a.pathname.slice(1)}${a.search}${a.hash}`;
}
function L(t) {
  const e = y(() => ({
    pathname: t.pathname,
    search: t.search,
    hash: t.hash,
    state: t.state,
    key: t.id
  }), [t]), [a, s] = $(e), o = y((n, r) => {
    const i = typeof n == "string" ? n : f(n);
    if (!i) {
      console.error("Invalid path provided to navigate");
      return;
    }
    r != null && r.replace ? t.replace(i, r.state) : t.push(i, r == null ? void 0 : r.state);
  }, [t]), l = E(() => ({
    go: (n) => t.go(n),
    push: (n, r) => o(n, { state: r }),
    replace: (n, r) => o(n, { replace: !0, state: r }),
    createHref: (n) => t.renderPath(f(n)),
    encodeLocation: (n) => S(t.renderPath(f(n))).toString()
  }), [t, o]);
  return N(() => t.on("change", () => s(e())), [t, e]), [a, l];
}
function A(t, e) {
  const a = (e == null ? void 0 : e.base) || "/";
  return {
    hook: E(() => () => {
      const [o, l] = $(() => {
        const i = (t.pathname + t.search + t.hash).replace(/^#!/, "");
        return i.startsWith(a) ? i.slice(a.length) || "/" : i;
      });
      N(() => {
        const r = () => {
          const h = (t.pathname + t.search + t.hash).replace(/^#!/, "");
          l(h.startsWith(a) ? h.slice(a.length) || "/" : h);
        };
        return t.on("change", r), () => t.off("change", r);
      }, []);
      const n = y((r, i) => {
        const h = typeof r == "string" ? r : f(r), w = `#!${a === "/" ? h : `${a}${h.startsWith("/") ? h : `/${h}`}`}`;
        i != null && i.replace ? t.replace(w, i.state) : t.push(w, i == null ? void 0 : i.state);
      }, []);
      return [o, n];
    }, [t, a]),
    base: a
  };
}
export {
  A as createRouterConfig,
  L as useIntegration
};
//# sourceMappingURL=index.js.map
