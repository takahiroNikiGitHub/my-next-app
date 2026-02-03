import Link from "next/link";
import FadeIn from "@/components/FadeIn";

// ユーザーの型定義
interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

export default async function Home() {
  // APIからデータを取得
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users: User[] = await response.json();

  return (
    <main className="min-h-screen bg-[#f8fafc] p-8 md:p-24">
      <div className="max-w-6xl mx-auto">
        
        {/* ヘッダーセクション */}
        <FadeIn>
          <div className="mb-16 text-center">
            <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">
              Team <span className="text-blue-600">Connect.</span>
            </h1>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">
              最新のNext.jsとFramer Motionを駆使した、
              インタラクティブなメンバーディレクトリ
            </p>
          </div>
        </FadeIn>

        {/* ユーザーカードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user, index) => (
            <FadeIn key={user.id}>
              <Link
                href={`/user/${user.id}`}
                className="group relative block h-full p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-500 overflow-hidden"
              >
                {/* マウスホバー時に背景がうっすら光る演出 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                    <span className="text-xl font-bold">{user.name[0]}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                    {user.name}
                  </h2>
                  <p className="text-slate-500 font-medium mb-6">
                    {user.company.name}
                  </p>

                  <div className="flex items-center text-sm text-slate-400 border-t border-slate-100 pt-6">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7-1 4 4m-7-3l7-1 4 4m-7-3l7-1 4 4M3 21v-8l7-1 4 4v8m-7-3l7-1 4 4m-7-3l7-1 4 4" />
                    </svg>
                    {user.email}
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
}