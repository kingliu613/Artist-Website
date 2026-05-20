import Link from "next/link";
import useCurrentUser from "./useCurrentUser";

export default function SiteHeader({ onOpenFavorites, hideFavorites = false, profileAvatar = "" }) {
  const { user, loading, logout } = useCurrentUser();
  const publishHref = user || loading ? "/publish" : "/auth?mode=register&next=/publish";

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="艺集首页">
        {profileAvatar ? <img src={profileAvatar} alt="" /> : <span>艺</span>}
        {!profileAvatar && <strong>艺集</strong>}
      </Link>
      <nav className="top-nav" aria-label="主导航">
        <Link href="/#market">市场</Link>
        <Link href="/#drops">新作</Link>
        <Link href="/news">新闻</Link>
        <Link href="/#guide">指南</Link>
        <Link href="/trust">担保</Link>
      </nav>
      <div className="header-actions">
        {!hideFavorites && (onOpenFavorites ? (
          <button className="button ghost small" type="button" onClick={onOpenFavorites}>收藏夹</button>
        ) : (
          <Link className="button ghost small" href="/profile?tab=favorites" aria-label="打开收藏夹">收藏夹</Link>
        ))}
        {user ? (
          <>
            <Link className="button ghost small auth-chip" href="/profile?tab=favorites"><img src={user.avatar} alt="" />{user.name}</Link>
            <button className="button ghost small" type="button" onClick={logout}>退出</button>
          </>
        ) : (
          <Link className="button ghost small" href="/auth">登录/注册</Link>
        )}
        <Link className="button small" href={publishHref}>发布作品</Link>
      </div>
    </header>
  );
}
