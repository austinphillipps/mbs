import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400">Revenus mensuels</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">45,290 €</p>
          <p className="text-sm text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% vs mois dernier</span>
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-slate-400">Produits vendus</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">1,248</p>
          <p className="text-sm text-blue-400 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>+8.2% vs mois dernier</span>
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400">Panier moyen</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">362 €</p>
          <p className="text-sm text-purple-400 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>+5.3% vs mois dernier</span>
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400">Taux de croissance</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">18.7%</p>
          <p className="text-sm text-cyan-400">Croissance annuelle</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
        <BarChart3 className="w-24 h-24 text-slate-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-2">Analyses avancées</h3>
        <p className="text-slate-400 max-w-md mx-auto">
          Les graphiques détaillés et analyses de tendances seront disponibles ici. Visualisez vos performances, identifiez les opportunités et prenez des décisions éclairées.
        </p>
      </div>
    </div>
  );
}
