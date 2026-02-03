import Link from 'next/link';

export default async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  // ① 最新のNext.jsの仕様に合わせてparamsを待機(await)します
  const { id } = await params;
  
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  
  // データの取得に失敗した場合の処理
  if (!response.ok) {
    return <div>ユーザーが見つかりませんでした</div>;
  }

  const user = await response.json();

return (
  <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
    <div className="max-w-md w-full">
      <Link href="/" className="text-slate-400 hover:text-white mb-6 inline-block transition-colors">
        ← Back to list
      </Link>
      
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-2xl border-4 border-white flex items-center justify-center text-3xl shadow-sm">
              👤
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-blue-600 font-medium mb-4">@{user.username}</p>
          
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <span className="w-8 text-xl">📧</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-8 text-xl">🌐</span>
              <span className="text-blue-500 underline">{user.website}</span>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</p>
              <p className="text-gray-700">{user.address?.street}, {user.address?.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}